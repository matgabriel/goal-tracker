import React from 'react'
import { storiesOf } from '@storybook/react'

import LoginScreen from './LoginScreen'

storiesOf('Authentication/LoginScreen', module).add('Regular', () => (
  <LoginScreen />
))
