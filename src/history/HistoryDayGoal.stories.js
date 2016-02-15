import { number, text } from '@storybook/addon-knobs'
import React from 'react'
import { storiesOf } from '@storybook/react'

import HistoryDayGoal from './HistoryDayGoal'

const goal = {
  id: '5bf57a79890a6e2c11ec9665',
  name: 'Apprendre React',
  target: 5,
  units: 'pages de doc',
}

storiesOf('History/HistoryDayGoal', module)
  .addParameters({ jest: 'HistoryDayGoal' })
  .add('Progress 1', () => (
    <HistoryDayGoal goal={goal} stats={[1, goal.target]} />
  ))
  .add('Progress max', () => (
    <HistoryDayGoal goal={goal} stats={[goal.target, goal.target]} />
  ))
  .add('playground', () => (
    <HistoryDayGoal
      goal={{
        id: '5bf57a79890a6e2c11ec9665',
        name: text('name', goal.name, 'Goal'),
        target: number(
          'target',
          goal.target,
          { min: 1, max: 10, range: true, step: 1 },
          'Goal'
        ),
        units: text('units', goal.units, 'Goal'),
      }}
      stats={[
        number(
          'progress',
          1,
          { min: 1, max: 10, range: true, step: 1 },
          'Stats'
        ),
        number(
          'historical target',
          5,
          { min: 1, max: 10, range: true, step: 1 },
          'Stats'
        ),
      ]}
    />
  ))
