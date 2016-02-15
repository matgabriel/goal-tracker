import { action } from '@storybook/addon-actions'
import { boolean, text } from '@storybook/addon-knobs'
import React from 'react'
import { storiesOf } from '@storybook/react'

import DeleteSettingDialog from './DeleteSettingDialog'

const goal = {
  id: '5bf57a79890a6e2c11ec9665',
  name: 'Apprendre React',
  target: 5,
  units: 'pages de doc',
}

storiesOf('Settings/DeleteSettingDialog', module)
  .add('Open with goal', () => (
    <DeleteSettingDialog
      goal={goal}
      onCancel={action('cancel')}
      onDelete={action('delete')}
      open
    />
  ))
  .add('playground', () => (
    <DeleteSettingDialog
      goal={{ ...goal, name: text('Goal name', goal.name) }}
      onCancel={action('cancel')}
      onDelete={action('delete')}
      open={boolean('Dialog open', true)}
    />
  ))
