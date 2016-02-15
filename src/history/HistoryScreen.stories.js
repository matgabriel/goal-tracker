import moment from 'moment'
import { Provider } from 'react-redux'
import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { storiesOf } from '@storybook/react'

import {
  arrayOf,
  GoalPropType,
  HistoryDayStatsPropType,
} from '../shared/prop-types'
import HistoryScreen from './HistoryScreen'
import { makeStore } from '../store'

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
const history = [
  {
    date: moment()
      .subtract(1, 'day')
      .format('YYYY-MM-DD'),
    progresses: {
      '5bf57a79890a6e2c11ec9665': [2, 5],
      '5bf57a79890a6e2c11ec9666': [1, 2],
    },
  },
  {
    date: moment()
      .subtract(2, 'days')
      .format('YYYY-MM-DD'),
    progresses: {
      '5bf57a79890a6e2c11ec9665': [4, 5],
      '5bf57a79890a6e2c11ec9666': [1, 2],
      '5bf57a79890a6e2c11ec9667': [2, 3],
    },
  },
  {
    date: moment()
      .subtract(3, 'days')
      .format('YYYY-MM-DD'),
    progresses: {
      '5bf57a79890a6e2c11ec9665': [3, 5],
      '5bf57a79890a6e2c11ec9666': [2, 2],
      '5bf57a79890a6e2c11ec9667': [1, 3],
    },
  },
]

storiesOf('History/HistoryScreen', module)
  .addDecorator((story) => <Router>{story()}</Router>)
  .add('With history', () => (
    <WrappedHistoryScreen goals={goals} history={history} />
  ))
  .add('With no history', () => (
    <WrappedHistoryScreen goals={goals} history={[]} />
  ))

function WrappedHistoryScreen({ goals, history }) {
  const store = makeStore({ goals, history })
  return (
    <Provider store={store}>
      <HistoryScreen />
    </Provider>
  )
}
WrappedHistoryScreen.propTypes = {
  goals: arrayOf(GoalPropType).isRequired,
  history: arrayOf(HistoryDayStatsPropType).isRequired,
}
