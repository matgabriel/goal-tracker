import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import React from 'react'

import HomeScreen from './main/HomeScreen'
import store from './store'

const App = () => (
  <Provider store={store}>
    <HomeScreen />
  </Provider>
)

export default hot(App)
