import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import React from 'react'
// import { Route, BrowserRouter as Router } from 'react-router-dom'

// import HistoryScreen from './history/HistoryScreen'
import HomeScreen from './main/HomeScreen'
// import PrivateRoute from './shared/PrivateRoute'
// import SettingsScreen from './settings/SettingsScreen'
import store from './store'

const App = () => (
  <Provider store={store}>
    <HomeScreen />
  </Provider>
)

export default hot(App)
