// Composant principal applicatif
// ==============================

import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import React from 'react'
import { Route, BrowserRouter as Router } from 'react-router-dom'

import HistoryScreen from './history/HistoryScreen'
import HomeScreen from './main/HomeScreen'
import PrivateRoute from './shared/PrivateRoute'
import SettingsScreen from './settings/SettingsScreen'
import store from './store'

const App = () => (
  // On enrobe le tout par le
  // [`Provider`](https://react-redux.js.org/api/provider) de Redux, pour que
  // l’état central et sa méthode `dispatch` puissent être accessibles à travers
  // toute l’arborescence de rendu.
  //
  // Ensuite on décrit les routes (imbriquées) de l’application, avec leurs
  // composants associés.  L’implémentation d’historique fournie explicitement
  // permet d’utiliser un historique basé `pushState` plutôt que celui, par
  // défaut, basé hash (parties `#…` des URLs).  Cela suppose toutefois une
  // capacité du serveur à retourner notre appli client correctement configurée
  // pour toutes ces “URLs profondes”.
  <Provider store={store}>
    <Router>
      <>
        <Route exact path='/' component={HomeScreen} />
        <PrivateRoute exact path='/settings' component={SettingsScreen} />
        <PrivateRoute exact path='/history' component={HistoryScreen} />
      </>
    </Router>
  </Provider>
)

export default hot(App)
