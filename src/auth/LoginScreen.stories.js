import { Provider } from 'react-redux'
import React from 'react'
import { storiesOf } from '@storybook/react'

import LoginScreen from './LoginScreen'
import { makeStore } from '../store'
import { LoginStatePropType } from '../shared/prop-types'

storiesOf('Authentication/LoginScreen', module)
  .add('Logged out', () => <WrappedLoginScreen loginState='logged-out' />)
  .add('Logging in', () => <WrappedLoginScreen loginState='pending' />)
  .add('Failed to log in', () => <WrappedLoginScreen loginState='failure' />)

function WrappedLoginScreen({ loginState }) {
  const store = makeStore({ currentUser: { loginState } })
  return (
    <Provider store={store}>
      <LoginScreen />
    </Provider>
  )
}
WrappedLoginScreen.propTypes = {
  loginState: LoginStatePropType.isRequired,
}
