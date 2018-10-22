import { hot } from 'react-hot-loader/root'
import React from 'react'

import LoginScreen from '../auth/LoginScreen'
import store from '../store'
import TrackerScreen from './TrackerScreen'

const HomeScreen = () => {
  const loggedIn = store.currentUser.loginState === 'logged-in'

  return loggedIn ? <TrackerScreen /> : <LoginScreen />
}

export default hot(HomeScreen)
