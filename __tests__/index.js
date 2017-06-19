// Copyright (c) 2016-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

/* global it, expect */

const _ = require('lodash')
const path = require('path')

const inlineImports = require('../')

const fixture = path.resolve.bind(path, __dirname, 'fixtures')

const mapImports = imports =>
  imports
    .map(i => _.mapKeys(i, (v, k) => k.replace(__dirname, '')))
    .map(i => _.mapValues(i, mapImports))

const mapImportsFlattened = imports =>
  imports.map(i => i.replace(__dirname, ''))

it('inlines imports', () => {
  const { scss } = inlineImports(fixture('a.scss'))
  expect(scss).toMatchSnapshot()
})

it('inlines imports with includePaths', () => {
  const { scss } = inlineImports(fixture('b.scss'), {
    includePaths: [fixture('modules')]
  })
  expect(scss).toMatchSnapshot()
})

it('throws an error for missing imports', () => {
  expect(() => {
    inlineImports(fixture('b.scss'))
  }).toThrow(/not found/)
})

it('returns the imports', () => {
  const { imports } = inlineImports(fixture('a.scss'))
  expect(mapImports(imports)).toMatchSnapshot()
})

it('returns the importsFlattened', () => {
  const { importsFlattened } = inlineImports(fixture('a.scss'))
  expect(mapImportsFlattened(importsFlattened)).toMatchSnapshot()
})
