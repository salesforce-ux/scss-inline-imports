/*
Copyright (c) 2016, salesforce.com, inc. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of salesforce.com, inc. nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/* global it */

const _ = require('lodash')
const { expect } = require('chai')
const fs = require('fs')
const path = require('path')

const inlineImports = require('../')

let fixture = path.resolve.bind(path, __dirname, 'fixtures')

let mapImports = imports =>
  imports
    .map(i => _.mapKeys(i, (v, k) => k.replace(__dirname, '')))
    .map(i => _.mapValues(i, mapImports))

let mapImportsFlattened = imports =>
  imports.map(i => i.replace(__dirname, ''))

it('inlines imports', () => {
  let result = inlineImports(fixture('a.scss'))
  let expected = fs.readFileSync(fixture('a-inlined.scss'), 'utf-8')
  expect(_.trim(result.scss)).to.equal(_.trim(expected))
})

it('inlines imports with includePaths', () => {
  let result = inlineImports(fixture('b.scss'), {
    includePaths: [fixture('modules')]
  })
  let expected = fs.readFileSync(fixture('b-inlined.scss'), 'utf-8')
  expect(_.trim(result.scss)).to.equal(_.trim(expected))
})

it('throws an error for missing imports', () => {
  expect(() => {
    inlineImports(fixture('b.scss'))
  }).to.throw(/not found/)
})

it('returns the imports', () => {
  let result = inlineImports(fixture('a.scss'))
  let expected = require('./fixtures/a-imports.json')
  expect(mapImports(result.imports)).to.deep.equal(expected)
})

it('returns the importsFlattened', () => {
  let result = inlineImports(fixture('a.scss'))
  let expected = require('./fixtures/a-imports-flattened.json')
  expect(mapImportsFlattened(result.importsFlattened)).to.deep.equal(expected)
})
