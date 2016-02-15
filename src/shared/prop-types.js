import {
  and,
  between,
  integer,
  keysOf,
  nonNegativeInteger,
} from 'airbnb-prop-types'
import { arrayOf, bool, func, node, objectOf, shape, string } from 'prop-types'

export { arrayOf, bool, func, node, nonNegativeInteger, shape, string }

export const positiveInteger = and([integer(), between({ gt: 0 })])

export const GoalPropType = shape({
  id: string.isRequired,
  name: string.isRequired,
  target: positiveInteger.isRequired,
  units: string.isRequired,
})

export const TodaysProgressPropType = and([
  keysOf(string),
  objectOf(nonNegativeInteger),
])
