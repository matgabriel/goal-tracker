import { Provider } from 'react-redux'
import React from 'react'
import { MemoryRouter as Router } from 'react-router-dom'
import { storiesOf } from '@storybook/react'

import { bool } from '../shared/prop-types'
import HomeScreen from './HomeScreen'
import { makeStore } from '../store'

storiesOf('Main/HomeScreen', module)
  .addDecorator((story) => <Router>{story()}</Router>)
  .add('Logged in', () => <WrappedHomeScreen loggedIn />)
  .add('Logged out', () => <WrappedHomeScreen loggedIn={false} />)

function WrappedHomeScreen({ loggedIn }) {
  const store = makeStore({
    currentUser: { loginState: loggedIn ? 'logged-in' : 'logged-out' },
  })
  return (
    <Provider store={store}>
      <HomeScreen />
    </Provider>
  )
}
WrappedHomeScreen.propTypes = {
  loggedIn: bool.isRequired,
}
