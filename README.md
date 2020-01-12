# SCSS Inline Imports [![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=salesforce-ux/scss-inline-imports)](https://dependabot.com) [![Build Status][travis-image]][travis-url] [![NPM version][npm-image]][npm-url]

## Getting Started

```javascript
const inlineImports = require('scss-inline-imports')

let { scss } = inlineImports('./index.scss')

// Options
inlineImports('./index.scss', {
  // An array of paths that should be searched when locating an import
  includePaths: [],
  // Include comments above each inlined import
  comments: false
})

// Extras
let { imports, importsFlattened } = inlineImports('./index.scss')

// imports
[
  {
    'path/to/entry': [
      {
        'path/to/first/import': [
          {
            'path/to/first/child/import': []
          }
        ]
      },
      {
        'path/to/second/import': [
          {
            'path/to/second/child/import': []
          }
        ]
      }
    ]
  }
]

// importsFlattened
[
  'path/to/first/child/import',
  'path/to/child/import',
  'path/to/second/child/import',
  'path/to/second/import',
  'path/to/entry'
]

```

## Running tests

Clone the repository, then:

```bash
npm install
# requires node >= 6.0.0
npm test
```

[npm-url]: https://npmjs.org/package/scss-inline-imports
[npm-image]: http://img.shields.io/npm/v/scss-inline-imports.svg

[travis-url]: https://travis-ci.org/salesforce-ux/scss-inline-imports
[travis-image]: https://travis-ci.org/salesforce-ux/scss-inline-imports.svg?branch=master
