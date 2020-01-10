import {
  and,
  between,
  integer,
  keysOf,
  nonNegativeInteger,
} from 'airbnb-prop-types'
import {
  arrayOf,
  bool,
  elementType,
  func,
  node,
  objectOf,
  oneOf,
  shape,
  string,
} from 'prop-types'

export {
  arrayOf,
  bool,
  elementType,
  func,
  node,
  nonNegativeInteger,
  shape,
  string,
}

export const positiveInteger = and([integer(), between({ gt: 0 })])

export const GoalPropType = shape({
  id: string.isRequired,
  name: string.isRequired,
  target: positiveInteger.isRequired,
  units: string.isRequired,
})

export const LoginStatePropType = oneOf([
  'logged-out',
  'pending',
  'logged-in',
  'failure',
])

export const TodaysProgressPropType = and([
  keysOf(string),
  objectOf(nonNegativeInteger),
])

function requiredHistoryDayProgressesPropType(props, propName, componentName) {
  const prefix = `${propName} in ${componentName} must`
  const value = props[propName]

  if (!Array.isArray(value)) {
    return new Error(`${prefix} be an array.`)
  }

  if (value.length !== 2 || !value.every(Number.isInteger)) {
    return new Error(`${prefix} be a pair of integers.`)
  }

  const [progress, target] = value
  if (progress < 0) {
    return new Error(`${prefix} start with a non-negative progress value.`)
  }

  if (target <= 0) {
    return new Error(`${prefix} end with a positive target value.`)
  }

  return null
}

export function HistoryDayProgressesPropType(props, propName, componentName) {
  const value = props[propName]

  if (value == null) {
    return null
  }

  return requiredHistoryDayProgressesPropType(props, propName, componentName)
}

HistoryDayProgressesPropType.isRequired = requiredHistoryDayProgressesPropType

export const HistoryDayStatsPropType = shape({
  date: string.isRequired,
  progresses: and([keysOf(string), objectOf(HistoryDayProgressesPropType)])
    .isRequired,
})
