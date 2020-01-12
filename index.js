// Copyright (c) 2016-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

const _ = require('lodash')
const fs = require('fs')
const path = require('path')

const IMPORT_PATTERN = /(@import)([\s\S]*?);/g

const parseImports = (chunk) => _(chunk)
  .split(',')
  .flatMap(c => c.split('\n'))
  .map(_.trim)
  .map(c => c.match(/('|")(.+?)('|")/))
  .compact()
  .filter(c => /^("|')/.test(c.input))
  .map(match => match[2])
  .value()

const getSearchPaths = (entry, importPath, includePaths) => {
  const ext = /\.scss$/.test(importPath) ? '' : '.scss'
  const searchDirectories = [path.dirname(entry)].concat(includePaths)
  return _(searchDirectories).flatMap(directory => {
    return ['', '_'].map(prefix => {
      const parsed = path.parse(path.join(directory, `${importPath}${ext}`))
      parsed.base = `${prefix}${parsed.base}`
      return path.format(parsed)
    })
  }).value()
}

const flattenImports = (imports) => _.flatMapDeep(imports, imports => {
  return _.map(imports, (imports, key) => {
    return flattenImports(imports).concat(key)
  })
})

const inlineImports = (entry, options) => {
  options = _.defaults({}, options, {
    comments: false,
    includePaths: []
  })

  const replaceImports = (entry, imports) =>
    (match, keyword, chunk) =>
      parseImports(chunk)
        .map(importPath => {
          const searchPaths = getSearchPaths(entry, importPath, options.includePaths)
          let foundSearchPath = false
          for (const searchPath of searchPaths) {
            try {
              fs.accessSync(searchPath)
              foundSearchPath = searchPath
            } catch (e) {}
          }
          if (foundSearchPath) {
            const comments = options.comments ? [
              '================================================',
              `// ${foundSearchPath}`,
              '================================================'
            ] : []
            const nextImports = []
            imports.push({ [foundSearchPath]: nextImports })
            return comments
              .concat(walk(foundSearchPath, nextImports))
              .join('\n')
          }
          throw new Error(`@import not found: "${importPath}" in "${entry}"`)
        })
        .join('\n')

  const walk = (entry, imports) => fs
    .readFileSync(entry, 'utf-8')
    .replace(IMPORT_PATTERN, replaceImports(entry, imports))

  const imports = [{
    [entry]: []
  }]

  const scss = walk(entry, imports[0][entry])

  return {
    scss,
    imports: imports,
    importsFlattened: flattenImports(imports)
  }
}

module.exports = inlineImports
