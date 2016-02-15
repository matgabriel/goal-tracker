import moment from 'moment'
import { number } from '@storybook/addon-knobs'
import React from 'react'

import HistoryDay from './HistoryDay'
import { isoDate, testedStoriesOf } from '../../.storybook/helpers'

const goals = [
  {
    id: '5bf57a79890a6e2c11ec9665',
    name: 'Apprendre React',
    target: 5,
    units: 'aspects',
  },
  {
    id: '5bf57a79890a6e2c11ec9666',
    name: 'Apprendre Redux',
    target: 2,
    units: 'vidéos',
  },
  {
    id: '5bf57a79890a6e2c11ec9667',
    name: 'Apprendre Webpack',
    target: 3,
    units: 'pages de doc',
  },
]
const refDate = moment().format('YYYY-MM-DD')
const progresses = {
  '5bf57a79890a6e2c11ec9665': [1, 5],
  '5bf57a79890a6e2c11ec9666': [1, 2],
  '5bf57a79890a6e2c11ec9667': [1, 3],
}

testedStoriesOf('History/HistoryDay', module)
  .add('Today', () => (
    <HistoryDay goals={goals} stats={{ date: refDate, progresses }} />
  ))
  .add('Yesterday', () => (
    <HistoryDay
      goals={goals}
      stats={{
        date: moment(refDate)
          .subtract(1, 'day')
          .format('YYYY-MM-DD'),
        progresses,
      }}
    />
  ))
  .add('2 days ago', () => (
    <HistoryDay
      goals={goals}
      stats={{
        date: moment(refDate)
          .subtract(2, 'days')
          .format('YYYY-MM-DD'),
        progresses,
      }}
    />
  ))
  .add('Earlier', () => (
    <HistoryDay
      goals={goals}
      stats={{
        date: moment(refDate)
          .subtract(3, 'days')
          .format('YYYY-MM-DD'),
        progresses,
      }}
    />
  ))
  .add('Playground', () => (
    <HistoryDay
      goals={goals}
      stats={{
        date: isoDate('Date', new Date(refDate), 'Date'),
        progresses: {
          '5bf57a79890a6e2c11ec9665': [
            number(
              'React progress',
              1,
              {
                range: true,
                min: 0,
                max: 5,
                step: 1,
              },
              'React stats'
            ),
            number(
              'React historical target',
              1,
              {
                range: true,
                min: 1,
                max: 10,
                step: 1,
              },
              'React stats'
            ),
          ],
          '5bf57a79890a6e2c11ec9666': [
            number(
              'Redux progress',
              1,
              {
                range: true,
                min: 0,
                max: 5,
                step: 1,
              },
              'Redux stats'
            ),
            number(
              'Redux historical target',
              1,
              {
                range: true,
                min: 1,
                max: 10,
                step: 1,
              },
              'Redux stats'
            ),
          ],
          '5bf57a79890a6e2c11ec9667': [
            number(
              'Webpack progress',
              1,
              {
                range: true,
                min: 0,
                max: 5,
                step: 1,
              },
              'Webpack stats'
            ),
            number(
              'Webpack historical target',
              1,
              {
                range: true,
                min: 1,
                max: 10,
                step: 1,
              },
              'Webpack stats'
            ),
          ],
        },
      }}
    />
  ))
