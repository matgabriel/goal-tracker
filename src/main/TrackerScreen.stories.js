import { number } from '@storybook/addon-knobs'
import { Provider } from 'react-redux'
import React from 'react'
import { storiesOf } from '@storybook/react'

import { isoDate } from '../../.storybook/helpers'
import { makeStore } from '../store'
import {
  arrayOf,
  GoalPropType,
  string,
  TodaysProgressPropType,
} from '../shared/prop-types'
import TrackerScreen from './TrackerScreen'

const goals = [
  {
    id: '5bf57a79890a6e2c11ec9665',
    name: 'Apprendre React',
    target: 5,
    units: 'aspects',
  },
  {
    id: '5bf57a79890a6e2c11ec9666',
    name: 'Apprendre Redux',
    target: 2,
    units: 'vidéos',
  },
  {
    id: '5bf57a79890a6e2c11ec9667',
    name: 'Apprendre Webpack',
    target: 3,
    units: 'pages de doc',
  },
]

const today = new Date().toISOString().split('T')[0]

storiesOf('Main/TrackerScreen', module)
  .add('Regular', () => (
    <WrappedTrackerScreen goals={goals} today={today} todaysProgress={{}} />
  ))
  .add('Playground', () => (
    <WrappedTrackerScreen
      goals={goals}
      today={isoDate('Date', new Date(today))}
      todaysProgress={{
        '5bf57a79890a6e2c11ec9665': number('React progress', 1, {
          range: true,
          min: 0,
          max: 5,
          step: 1,
        }),
        '5bf57a79890a6e2c11ec9666': number('Redux progress', 1, {
          range: true,
          min: 0,
          max: 2,
          step: 1,
        }),
        '5bf57a79890a6e2c11ec9667': number('Webpack progress', 1, {
          range: true,
          min: 0,
          max: 3,
          step: 1,
        }),
      }}
    />
  ))

function WrappedTrackerScreen({ goals, today, todaysProgress }) {
  const store = makeStore({ goals, today, todaysProgress })
  return (
    <Provider store={store}>
      <TrackerScreen />
    </Provider>
  )
}
WrappedTrackerScreen.propTypes = {
  goals: arrayOf(GoalPropType).isRequired,
  today: string.isRequired,
  todaysProgress: TodaysProgressPropType.isRequired,
}
