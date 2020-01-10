// Types complexes de props React
// ==============================

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
  oneOfType,
  shape,
  string,
} from 'prop-types'

// Les composants React peuvent déclarer [le type et la structure des
// props](https://fr.reactjs.org/docs/typechecking-with-proptypes.html) qui leur
// sont passées, pour bénéficier d’une aide à la validation affichée
// généralement sous forme d’erreurs dans la console du navigateur.
//
// Outre les types prédéfinis, il est possible de déclarer des types complexes,
// avec des objets, des tableaux, etc.  Lorsqu'ils sont répétés à travers le
// code, autant les centraliser, comme ici.

// On ré-exporte ici tous les types externes exploités par l’application, comme
// ça le reste du code de l’appli n’a pas à se soucier de l’origine des
// validateurs (classiques, Airbnb, ou nous) : il importe depuis ce module à
// tous les coups.
export {
  arrayOf,
  bool,
  elementType,
  func,
  node,
  nonNegativeInteger,
  oneOfType,
  shape,
  string,
}

// Validateur d’entier positif non nul (ex. valeurs d’objectifs).  Airbnb
// fournit `nonNegativeInteger`, mais pas la version sans le zéro…
export const positiveInteger = and([integer(), between({ gt: 0 })])

// Description d’un objectif, utilisé dans de nombreux composants.
export const GoalPropType = shape({
  id: string.isRequired,
  name: string.isRequired,
  target: positiveInteger.isRequired,
  units: string.isRequired,
})

// Description de l’état courant de login (valeurs autorisées dans l’état global
// applicatif)
export const LoginStatePropType = oneOf([
  'logged-out',
  'pending',
  'logged-in',
  'failure',
])

// Description de la tranche `todaysProgress` de l’état global, utilisé par
// `TrackerScreen`.
export const TodaysProgressPropType = and([
  keysOf(string),
  objectOf(nonNegativeInteger),
])

// Type pour les props `currentUser`, qui reflète la structure de la tranche
// `currentUser` de l’état global applicatif.
export const CurrentUserPropType = shape({
  loginState: LoginStatePropType.isRequired,
  email: string,
})

// Base "champ requis" du validateur pour les champs `progresses` des journées
// d’historique.  Sera exposé sous la version `isRequired` d’un enrobage qui
// lève cette exigence en vérifiant `null` et `undefined` (voir ci-après).
function requiredHistoryDayProgressesPropType(props, propName, componentName) {
  const prefix = `${propName} in ${componentName} must`
  const value = props[propName]

  // 1. Le champ doit être un tableau
  if (!Array.isArray(value)) {
    return new Error(`${prefix} be an array.`)
  }

  // 2. Il doit contenir une paire de véritables nombres entiers
  if (value.length !== 2 || !value.every(Number.isInteger)) {
    return new Error(`${prefix} be a pair of integers.`)
  }

  const [progress, target] = value
  // 3. La valeur de progression ne peut être négative
  if (progress < 0) {
    return new Error(`${prefix} start with a non-negative progress value.`)
  }

  // 4. La valeur cible dénormalisée de l'objectif ne peut être
  // négative ou nulle.
  if (target <= 0) {
    return new Error(`${prefix} end with a positive target value.`)
  }

  // Bon, bah tout va bien alors…
  return null
}

// Validateur exporté, en mode "non requis" pour coller aux conventions des
// `React.PropTypes`.  Lève en fait l’exigence de présence du code noyau en
// court-circuitant les cas `null` et `undefined` (d’où le `==` laxiste).
export function HistoryDayProgressesPropType(props, propName, componentName) {
  const value = props[propName]

  if (value == null) {
    return null
  }

  return requiredHistoryDayProgressesPropType(props, propName, componentName)
}

// Exposition du validateur noyau, qui exige le champ, sous la propriété chaînée
// `isRequired` habituelle.
HistoryDayProgressesPropType.isRequired = requiredHistoryDayProgressesPropType

// Description d’un jour de stats dans l’historique.
export const HistoryDayStatsPropType = shape({
  date: string.isRequired,
  progresses: and([
    // Exigence sur les clés : IDs d’objectifs, donc chaînes représentant des
    // BSON IDs.
    keysOf(string),
    // Exigence sur les valeurs : paires d’entiers avec contraintes
    // supplémentaires
    objectOf(HistoryDayProgressesPropType),
  ]).isRequired,
})
