import { createStore } from 'redux'
import { subDays } from 'date-fns'

import goalTrackerReducer from './reducers'
import { isoDate } from './lib/helpers'

const DEFAULT_STATE = {
  currentUser: {
    loginState: 'logged-in',
    email: 'christophe@delicious-insights.com',
  },
  goals: [
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
  ],
  today: isoDate(new Date()),
  todaysProgress: {
    '5bf57a79890a6e2c11ec9665': 1,
    '5bf57a79890a6e2c11ec9666': 1,
    '5bf57a79890a6e2c11ec9667': 1,
  },
  history: [
    {
      date: isoDate(subDays(new Date(), 1)),
      progresses: {
        '5bf57a79890a6e2c11ec9665': [2, 5],
        '5bf57a79890a6e2c11ec9666': [1, 2],
      },
    },
    {
      date: isoDate(subDays(new Date(), 2)),
      progresses: {
        '5bf57a79890a6e2c11ec9665': [4, 5],
        '5bf57a79890a6e2c11ec9666': [1, 2],
        '5bf57a79890a6e2c11ec9667': [2, 3],
      },
    },
    {
      date: isoDate(subDays(new Date(), 3)),
      progresses: {
        '5bf57a79890a6e2c11ec9665': [3, 5],
        '5bf57a79890a6e2c11ec9666': [2, 2],
        '5bf57a79890a6e2c11ec9667': [1, 3],
      },
    },
  ],
}

const devToolsEnhancer =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : (x) => x

export function makeStore(initialState = DEFAULT_STATE) {
  const enhancer = devToolsEnhancer

  const store = createStore(goalTrackerReducer, initialState, enhancer)

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextGTR = require('./reducers').default
      store.replaceReducer(nextGTR)
    })
  }

  return store
}

const store = makeStore()

export default store
