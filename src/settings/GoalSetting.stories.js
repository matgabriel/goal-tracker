import { action } from '@storybook/addon-actions'
import React from 'react'
import { storiesOf } from '@storybook/react'
import { number, text } from '@storybook/addon-knobs'

import List from '@material-ui/core/List'

import GoalSetting from './GoalSetting'

const goal = {
  id: '5bf57a79890a6e2c11ec9665',
  name: 'Apprendre React',
  target: 5,
  units: 'pages de doc',
}

storiesOf('Settings/GoalSetting', module)
  .addDecorator((story) => <List>{story()}</List>)
  .add('Regular', () => (
    <GoalSetting
      goal={goal}
      onDeleteClick={action('deleteClick')}
      onEditClick={action('editClick')}
    />
  ))
  .add('playground', () => (
    <GoalSetting
      goal={{
        ...goal,
        name: text('Goal name', goal.name),
        target: number('Goal target', goal.target),
        units: text('Goal units', goal.units),
      }}
      onDeleteClick={action('deleteClick')}
      onEditClick={action('editClick')}
    />
  ))
