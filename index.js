/*
Copyright (c) 2016, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const IMPORT_PATTERN = /(@import)([\s\S]*?);/g

let parseImports = (chunk) => _(chunk)
  .split(',')
  .flatMap(c => c.split('\n'))
  .map(_.trim)
  .map(c => c.match(/('|")(.+?)('|")/))
  .compact()
  .map(match => match[2])
  .value()

let getSearchPaths = (entry, importPath, includePaths) => {
  let ext = /\.scss$/.test(importPath) ? '' : '.scss'
  let searchDirectories = [path.dirname(entry)].concat(includePaths)
  return _(searchDirectories).flatMap(directory => {
    return ['', '_'].map(prefix => {
      let parsed = path.parse(path.join(directory, `${importPath}${ext}`))
      parsed.base = `${prefix}${parsed.base}`
      return path.format(parsed)
    })
  }).value()
}

let flattenImports = (imports) => _.flatMapDeep(imports, imports => {
  return _.map(imports, (imports, key) => {
    return flattenImports(imports).concat(key)
  })
})

let inlineImports = (entry, options) => {
  options = _.defaults({}, options, {
    comments: false,
    includePaths: []
  })

  let replaceImports = (entry, imports) =>
    (match, keyword, chunk) =>
      parseImports(chunk)
        .map(importPath => {
          let searchPaths = getSearchPaths(entry, importPath, options.includePaths)
          for (let searchPath of searchPaths) {
            try {
              fs.accessSync(searchPath)
              let comments = options.comments ? [
                '================================================',
                `// ${searchPath}`,
                '================================================'
              ] : []
              let nextImports = []
              imports.push({ [searchPath]: nextImports })
              return comments
                .concat(walk(searchPath, nextImports))
                .join('\n')
            } catch (e) {}
          }
          throw new Error(`@import not found: "${importPath}" in "${entry}"`)
        })
        .join('\n')

  let walk = (entry, imports) => fs
    .readFileSync(entry, 'utf-8')
    .replace(IMPORT_PATTERN, replaceImports(entry, imports))

  let imports = [{
    [entry]: []
  }]

  let scss = walk(entry, imports[0][entry])

  return {
    scss,
    imports: imports,
    importsFlattened: flattenImports(imports)
  }
}

module.exports = inlineImports
