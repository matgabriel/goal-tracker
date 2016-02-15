// Enrobeur de route authentifiée
// ==============================
//
// Permet de définir des routes exigeant que l’utilisateur soit logué.  En
// pratique, définit une route classique amenant sur un HOC connecté au *store*
// Redux et vérifiant l’état de l’authentification.  Si l’utilisateur est
// connecté, on *render* le composant normalement, sinon on utilise un
// `<Redirect />` pour ramener à l’écran de connexion.

import React from 'react'
import { Redirect, Route, useHistory, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { elementType } from './prop-types'

const PrivateRoute = ({ component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => <PrivateComponent component={component} {...props} />}
  />
)

PrivateRoute.propTypes = {
  component: elementType.isRequired,
}

const PrivateComponent = ({ component, ...props }) => {
  const loggedIn = useSelector(selectLoggedIn)
  const history = useHistory()
  const from = useLocation()

  if (loggedIn) {
    return React.createElement(component, props)
  }

  // Si on résulte d’une nav interactive une fois l’appli rendue côté client,
  // `history.action` vaut `PUSH` : une interdiction devrait donc faire l’objet
  // d’un ajout d’URL dans l’historique (vers le login), et non un remplacement
  // de l’URL précédente.  En revanche, lors d’un rendu initial sur navigation
  // classique du browser, `history.action` sera autre (normalement `POP`), et
  // de fait, on devrait éviter une étape d’historique intermédiaire.
  const shouldPush = history.action === 'PUSH'

  return <Redirect push={shouldPush} to={{ pathname: '/', state: { from } }} />
}
PrivateComponent.propTypes = {
  component: elementType.isRequired,
}

const selectLoggedIn = ({ currentUser: { loginState } }) =>
  loginState === 'logged-in'

export default PrivateRoute
