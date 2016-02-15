import { number } from '@storybook/addon-knobs'
import React from 'react'
import { storiesOf } from '@storybook/react'

import Gauge from './Gauge'

storiesOf('Shared/Gauge', module)
  .addParameters({ jest: 'Gauge' })
  .add('Empty, using defaults', () => <Gauge value={0} />)
  .add('50, using defaults', () => <Gauge value={50} />)
  .add('50, using custom max', () => <Gauge value={50} max={75} />)
  .add('playground', () => (
    <Gauge
      value={number('value', 50, { range: true, min: 0, max: 100, step: 1 })}
      max={number('max', 100, { min: 1, max: 100, range: true, step: 1 })}
    />
  ))
