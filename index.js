// Copyright (c) 2016-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

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
