// Reducer combiné global
// ======================

import { combineReducers } from 'redux'
import reduceReducers from 'reduce-reducers'

import closeDay from './closeDay'
import currentUser from './currentUser'
import goals from './goals'
import history from './history'
import today from './today'
import todaysProgress from './todaysProgress'

// *(Structuration de type
// [Ducks](https://github.com/erikras/ducks-modular-redux))*

// Selon la [meilleure pratique
// Redux](https://redux.js.org/recipes/structuring-reducers/splitting-reducer-logic),
// nous avons réalisé indépendamment les *reducers* des diverses parties de
// l’état.  On va utiliser
// [`combineReducers`](https://redux.js.org/api/combinereducers) pour les
// recombiner en un seul, qui délèguera automatiquement aux nôtres, champ par
// champ.
//
// Toutefois, une action (`CLOSE_DAY`) impacte plusieurs champs (en
// l’occurrence, `todaysProgress` et `history`), de sorte que nous allons la
// traiter dans un reducer *top-level* dédié (`closeDay`).

// On crée le reducer consolidé…
const coreReducer = combineReducers({
  // … basé sur nos reducers individuels pour chaque partie…
  currentUser,
  goals,
  history,
  today,
  todaysProgress,
})

// Ensuite, on définit le reducer final exporté par ce module, qui sera donc
// celui exploité par le *store* Redux, afin de traiter les actions
// multi-champs.
const goalTrackerReducer = reduceReducers(coreReducer, closeDay)

export default goalTrackerReducer
