import { action } from '@storybook/addon-actions'
import { boolean, number, radios, text } from '@storybook/addon-knobs'
import React from 'react'
import { storiesOf } from '@storybook/react'

import AddSettingDialog from './AddSettingDialog'

const goal = {
  id: '5bf57a79890a6e2c11ec9665',
  name: 'Apprendre React',
  target: 5,
  units: 'pages de doc',
}
const { id, ...newGoal } = goal

storiesOf('Settings/AddSettingDialog', module)
  .add('Add a new goal', () => (
    <AddSettingDialog
      goal={newGoal}
      onCancel={action('cancel')}
      onAdd={action('add')}
      open
    />
  ))
  .add('Edit an existing goal', () => (
    <AddSettingDialog
      goal={goal}
      onCancel={action('cancel')}
      onAdd={action('add')}
      open
    />
  ))
  .add('playground', () => (
    <AddSettingDialog
      goal={{
        ...idForMode(),
        name: text('Name', goal.name),
        target: number('Target', goal.target, {
          range: true,
          min: 1,
          max: 100,
          step: 1,
        }),
        units: text('Units', goal.units),
      }}
      onCancel={action('cancel')}
      onAdd={action('add')}
      open={boolean('Dialog open', true)}
    />
  ))

function idForMode() {
  const basis = radios(
    'Mode',
    {
      Addition: '',
      Edition: '5bf57a79890a6e2c11ec9665',
    },
    ''
  )
  return basis ? { id: basis } : {}
}
