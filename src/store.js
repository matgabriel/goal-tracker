// État central Redux
// ==================

import { compose, createStore } from 'redux'
import localForage from 'localforage'
import { offline } from '@redux-offline/redux-offline'
import offlineConfig from '@redux-offline/redux-offline/lib/defaults'
import { subDays } from 'date-fns'

import goalTrackerReducer from './reducers'
import { isoDate } from './lib/helpers'

// L’état consolidé de l’application est géré par [Redux](http://redux.js.org/).
// La [seule manière de le faire évoluer](https://redux.js.org/basics/data-flow)
// est d’appeler sa méthode `dispatch(…)` en lui transmettant un [descripteur
// d’action](https://redux.js.org/basics/actions) (normalement fourni par une
// des fonctions de `action-creators.js`).
//
// L’état en question est *immutable* : il n’est jamais modifié en place, mais
// génère à chaque fois une nouvelle version de lui-même, si besoin.
//
// Le descriptif de ces évolutions est fourni par les
// [*reducers*](https://redux.js.org/basics/reducers), qui sont combinés pour
// fournir un *reducer* unique, utilisé à la création du *store* Redux. C’est le
// *reducer* principal, qui pilote toutes les évolutions de l’état.

// État par défaut, utile pour notre développement mais qui serait sûrement
// beaucoup plus réduit en production.
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

const reduxOfflineConfig = {
  ...offlineConfig,
  persistOptions: {
    storage: localForage,
  },
}

const devToolsEnhancer =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : (x) => x

// Cet export nous permet de construire facilement un *store* selon nos besoins
// (et notamment un état initial précis), par exemple lors des tests ou dans
// StoryBook.
export function makeStore(initialState = DEFAULT_STATE) {
  const nodeEnv = process.env.NODE_ENV
  const shouldPersist = nodeEnv !== 'test' && nodeEnv !== 'storybook'

  // Améliorations des capacités de base du *store* Redux à l’aide d’une
  // composée de fonctions *enhancers*.  On y trouve la connexion aux [Redux Dev
  // Tools](https://github.com/zalmoxisus/redux-devtools-extension), s’ils sont
  // installés dans le navigateur, ainsi que la gestion de la persistance côté
  // client et des appels API par
  // [redux-offline](https://github.com/redux-offline/redux-offline).
  const enhancer = shouldPersist
    ? compose(offline(reduxOfflineConfig), devToolsEnhancer)
    : devToolsEnhancer

  // Création à proprement parler du *store*, en fournissant son *reducer* (au
  // minimum), un état par défaut et la composée d’*enhancers* à y injecter.
  const store = createStore(goalTrackerReducer, initialState, enhancer)

  // Gestion du HMR sur les réducteurs pendant le développement.
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
