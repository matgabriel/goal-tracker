import { addSeconds, differenceInCalendarDays, parseISO } from 'date-fns'

import { closeDay } from '../reducers/closeDay'
import store from '../store'

const STAMP_FORMATTER = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

const clock = setInterval(checkClock, 1000)

checkForTodaysFirstUse()

if (module.hot) {
  module.hot.accept()
  module.hot.dispose(() => {
    clearInterval(clock)
  })
}

const HISTORY_TRIGGER_TIME =
  process.env.NODE_ENV === 'production'
    ? '00:00:00'
    : STAMP_FORMATTER.format(addSeconds(new Date(), 10))

function checkClock() {
  const now = STAMP_FORMATTER.format(new Date())

  if (now === HISTORY_TRIGGER_TIME) {
    store.dispatch(closeDay())
  }
}

function checkForTodaysFirstUse() {
  const storesLastDay = store.getState().today
  if (
    storesLastDay &&
    differenceInCalendarDays(parseISO(storesLastDay), new Date()) < 0
  ) {
    store.dispatch(closeDay())
  }
}
