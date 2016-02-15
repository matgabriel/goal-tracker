import React from 'react'
import { storiesOf } from '@storybook/react'

import TogglablePasswordField from './TogglablePasswordField'

storiesOf('Authentication/TogglablePasswordField', module)
  .add('No value', () => <TogglablePasswordField />)
  .add('Initial value', () => <TogglablePasswordField value='secret' />)
