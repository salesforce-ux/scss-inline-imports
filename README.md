# SCSS Inline Imports

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

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

## License

Copyright (c) 2016, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

[npm-url]: https://npmjs.org/package/scss-inline-imports
[npm-image]: http://img.shields.io/npm/v/scss-inline-imports.svg

[travis-url]: https://travis-ci.org/salesforce-ux/scss-inline-imports
[travis-image]: https://travis-ci.org/salesforce-ux/scss-inline-imports.svg?branch=master
