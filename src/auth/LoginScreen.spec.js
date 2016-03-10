// Écran de connexion (tests)
// ==========================

import React from 'react'
import { fireEvent, render } from '@testing-library/react'
// Cet import enregistre des assertions supplémentaires liées à jest-dom dans le
// `expect()` de Jest, telles que `toBeDisabled()`, `toHaveClass()` ou encore
// `toHaveAttribute()`.
import '@testing-library/jest-dom/extend-expect'

import LoginScreen from './LoginScreen'
import { makeStore } from '../store'
import { Provider } from 'react-redux'

describe('<LoginScreen />', () => {
  it('should adjust button when logged-out based on values', () => {
    // Si la mise en place va au-delà d’un simple `render()` de RTL, on
    // centralise celle-ci dans une fonction locale `setup()`, par convention.
    // La fonction est déclarée plus bas.  Les arguments varient d’une suite de
    // tests à l’autre, selon ce qu’on veut faire varier.  Ici, c’est le
    // `currentUser.loginState` initial.
    const { getByLabelText, getByText } = setup('logged-out')
    // On récupère le bouton d’envoi du formulaire par son texte…
    const button = getByText('Connecte-toi')
    // …et on vérifie qu’à ce stade (champs vides) il est désactivé.
    expect(button).toBeDisabled()

    // On récupère le champ e-mail par son libellé…
    const emailField = getByLabelText(/E-mail/)
    // …et on simule une saisie.  En pratique, le `onChange` de React réagit à
    // une pléthore d’événements DOM (ex. `change`, `input`, `keypress`,
    // `paste`), mais ici on va opter pour un bon vieux `change` à l’ancienne.
    // Le second argument fournit les propriétés qu’on souhaite personnaliser
    // pour l’objet événement qui sera généré.
    fireEvent.change(emailField, { target: { value: 'foo@bar.com' } })
    expect(button).toBeDisabled()

    const passwordField = getByLabelText(/Mot de passe/)
    fireEvent.change(passwordField, { target: { value: 'foo' } })
    // Une fois les deux champs remplis, le bouton de connexion devrait être
    // disponible.
    expect(button).toBeEnabled()
  })

  it('should disable the button when pending', () => {
    const { getByText } = setup('pending')
    expect(getByText('Connecte-toi')).toBeDisabled()
  })

  it('should restore the button and display a snackbar on failure', () => {
    const { getByText, queryByText } = setup('failure')
    expect(getByText('Connecte-toi')).toBeDisabled()
    // `queryByText` renvoie soit le composant trouvé, soit `null`,
    // contrairement à `getByText()`, qui lève une exception si le composant est
    // absent.  On opte ici pour une assertion plus explicite et descriptive.
    expect(queryByText('Identifiant ou mot de passe invalide')).not.toBeNull()
  })

  // Fonction centralisée de mise en place du test.  Comme le composant utilise
  // un store Redux en vigueur (en raison de ses hooks React-Redux), il nous
  // faut l’enrober dans un `<Provider>` avec un *store* adéquat.  C’est tout
  // l’intérêt d’avoir exporté notre `makeStore()` en plus du *store* applicatif
  // par défaut.
  function setup(loginState) {
    const store = makeStore({ currentUser: { loginState } })
    return render(
      <Provider store={store}>
        <LoginScreen />
      </Provider>
    )
  }
})
