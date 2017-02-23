// Copyright (c) 2016-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

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
