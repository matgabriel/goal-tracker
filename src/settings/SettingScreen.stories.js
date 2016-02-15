import { Provider } from 'react-redux'
import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { storiesOf } from '@storybook/react'

import { arrayOf, GoalPropType } from '../shared/prop-types'
import { makeStore } from '../store'
import SettingsScreen from './SettingsScreen'

const currentUser = { email: 'foo@bar.com', loginState: 'success' }

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

storiesOf('Settings/SettingsScreen', module)
  .addDecorator((story) => <Router>{story()}</Router>)
  .add('No goals', () => <WrappedSettingsScreen goals={[]} />)
  .add('With goals', () => <WrappedSettingsScreen goals={goals} />)

function WrappedSettingsScreen({ goals }) {
  const store = makeStore({ currentUser, goals })
  return (
    <Provider store={store}>
      <SettingsScreen />
    </Provider>
  )
}
WrappedSettingsScreen.propTypes = {
  goals: arrayOf(GoalPropType).isRequired,
}
