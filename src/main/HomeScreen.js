import { hot } from 'react-hot-loader/root'
import React from 'react'
import { useSelector } from 'react-redux'

import LoginScreen from '../auth/LoginScreen'
import TrackerScreen from './TrackerScreen'

const HomeScreen = () => {
  const loggedIn = useSelector(selectLoggedIn)

  return loggedIn ? <TrackerScreen /> : <LoginScreen />
}

const selectLoggedIn = ({ currentUser: { loginState } }) =>
  loginState === 'logged-in'

export default hot(HomeScreen)
