import React from 'react'
import { render } from 'react-dom'

import App from './App'

import './lib/clock'

render(<App />, document.getElementById('root'))

if (module.hot) {
  module.hot.accept()
}
