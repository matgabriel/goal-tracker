import { action } from '@storybook/addon-actions'
import { number, text } from '@storybook/addon-knobs'
import React from 'react'

import GoalTrackerWidget from './GoalTrackerWidget'
import { testedStoriesOf } from '../../.storybook/helpers'

import './TrackerScreen.styl'

const TSDecorator = (storyFn) => <div className='goalTracker'>{storyFn()}</div>

const goal = {
  id: '5bf57a79890a6e2c11ec9665',
  name: 'Apprendre React',
  target: 5,
  units: 'pages de doc',
}

testedStoriesOf('Main/GoalTrackerWidget', module)
  .addParameters({ jest: 'GoalTrackerWidget' })
  .addDecorator(TSDecorator)
  .add('Incomplete', () => (
    <GoalTrackerWidget
      goal={goal}
      progress={1}
      onProgress={action('onProgress')}
    />
  ))
  .add('Complete', () => (
    <GoalTrackerWidget
      goal={goal}
      progress={goal.target}
      onProgress={action('onProgress')}
    />
  ))
  .add('playground', () => (
    <GoalTrackerWidget
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
      progress={number(
        'progress',
        1,
        { min: 0, max: 10, range: true, step: 1 },
        'Progress'
      )}
      onProgress={action('onProgress')}
    />
  ))
