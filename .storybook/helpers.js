import { date } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { withTests } from '@storybook/addon-jest'

export function isoDate(...args) {
  const basis = date(...args)
  return new Date(basis).toISOString().split('T')[0]
}

export function testedStoriesOf(name, module) {
  const shortName = name.split('/').slice(-1)[0]
  let results = {}
  try {
    results = require('../jest/test-results-for-storybook.json')
  } catch (err) {}

  return storiesOf(name, module)
    .addDecorator(withTests({ results }))
    .addParameters({ jest: shortName })
}

if (module.hot) {
  module.hot.accept()
}
