// Point d’entrée de l’application
// ===============================

import { install as installOfflineHandling } from 'offline-plugin/runtime'
import React from 'react'
import { render } from 'react-dom'

import App from './App'

import './lib/clock'

// Installe la gestion offline par
// [ServiceWorker](https://developer.mozilla.org/fr/docs/Web/API/Service_Worker_API/Using_Service_Workers)
// ou
// [ApplicationCache](https://developer.mozilla.org/fr/docs/Utiliser_Application_Cache).
// En pratique, examine les technologies prises en charge par le navigateur
// courant et, suivant le cas, enregistre le ServiceWorker généré ou incruste un
// `iframe` chargeant la page vide qui référence le manifeste ApplicationCache.
installOfflineHandling()

// Rendu initial au chargement
render(<App />, document.getElementById('root'))

// Lorsque le module est chargé par [Webpack](http://webpack.github.io/docs/)
// avec le *Hot Module Replacement*, l’objet prédéfini `module` se voit doter
// d'une propriété `hot`, qui nous permet de le détecter.  On peut alors
// indiquer que le module courant est apte à être remplacé à la volée (le HMR
// est "opt-in" : si un module change alors que ni lui, ni aucun module plus
// haut dans chaîne de `require`/`import`, n’a signifié son acceptation, alors
// le HMR n’a pas lieu).
if (module.hot) {
  module.hot.accept()
}
