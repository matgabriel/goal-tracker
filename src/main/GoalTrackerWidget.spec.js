// Suivi du jour pour un objectif (tests)
// ======================================

import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
// Cet import enregistre des assertions supplémentaires liées à jest-dom dans le
// `expect()` de Jest, telles que `toBeDisabled()`, `toHaveClass()` ou encore
// `toHaveAttribute()`.
import '@testing-library/jest-dom/extend-expect'

import GoalTrackerWidget from './GoalTrackerWidget'

// Classiquement, quand on décrit un composant React, on utilise sa balise JSX
// comme sujet de la description.  Celui-ci est censé…
describe('<GoalTrackerWidget />', () => {
  const goal = {
    id: '0123456789abcdef01234567',
    name: 'My goal',
    target: 42,
    units: 'wombats',
  }

  describe('when not completed', () => {
    // …produire le balisage attendu pour un objectif non atteint
    // ----------------------------------------------------------
    it('should render appropriately', () => {
      // On va tester quatre valeurs pour le taux de complétion: les “bornes” 0,
      // 1 et 41, d’une part, et une valeur quelconque, ici le 21 en plein
      // milieu, d’autre part.
      for (const progress of [0, 1, 21, 41]) {
        const { getByRole, queryByTestId, queryByText } = render(
          <GoalTrackerWidget goal={goal} progress={progress} />
        )
        // Le composant de type titre (h1, h2 ou autre) devrait avoir le nom de
        // l’objectif comme texte (fut-ce un texte partiel).
        expect(getByRole('heading')).toHaveTextContent(goal.name)
        // Le composant ayant un rôle de barre de progression (créé en interne
        // par le `<LinearProgress/>` utilisé par `<Gauge/>`) devrait avoir la
        // bonne valeur dans l’attribut ARIA adapté.  C’est plus propre à tester
        // que les styles en termes de largeur, etc.
        expect(getByRole('progressbar')).toHaveAttribute(
          'aria-valuenow',
          String(Math.round((progress * 100) / goal.target))
        )
        // On devrait trouver quelque part un texte bien précis de
        // contextualisation.
        //
        // `queryByText` renvoie soit le composant trouvé, soit `null`,
        // contrairement à `getByText()`, qui lève une exception si le composant
        // est absent.  On opte ici pour une assertion plus explicite et
        // descriptive.
        expect(
          queryByText(`${progress} ${goal.units} sur ${goal.target}`)
        ).not.toBeNull()

        // Il arrive que certains composants ne puissent pas être ciblés par les
        // requêtes usuelles de RTL, en raison de l’implémentation des
        // composants React concernés.  Dans un tel cas, on peut les doter d’une
        // *prop* `data-testid`, qui sert spécifiquement à ça.
        expect(queryByTestId('in-progress')).not.toBeNull()
        // Dans une boucle de `render()`, il faut penser à bien démonter les
        // arbos d’un tour à l’autre pour éviter qu’elles ne s’accumulent.
        cleanup()
      }
    })

    // …déclencher correctement son `onProgress` au clic
    // -------------------------------------------------
    it('should trigger its onProgress on click', () => {
      const progress = 21
      // Pour vérifier que le *callback* transmis est bien appelé, rien de tel
      // qu’un *spy* fourni par
      // [jest.fn()](https://jestjs.io/docs/en/jest-object#mock-functions).
      const onProgress = jest.fn()
      const { getByRole } = render(
        <GoalTrackerWidget
          goal={goal}
          onProgress={onProgress}
          progress={progress}
        />
      )

      // On simule le clic.
      fireEvent.click(getByRole('button'))
      expect(onProgress).toHaveBeenCalledTimes(1)
      expect(onProgress).toHaveBeenCalledWith(goal)
    })

    // …valider le snapshot
    // --------------------
    // (avoir une structure détaillée identique à la dernière qui a été validée
    // par les développeurs au moyen d’un snapshot.)
    it('should otherwise match the expected snapshot', () => {
      const { container } = render(
        <GoalTrackerWidget goal={goal} progress={21} />
      )

      expect(container).toMatchSnapshot()
    })
  })

  describe('when completed (or exceeded)', () => {
    // …produire le balisage attendu pour un objectif atteint (voire dépassé)
    // ----------------------------------------------------------------------
    it('should render appropriately', () => {
      // On va tester trois valeurs de dépassement de l’objectif: la borne zéro
      // (objectif atteint, pile-poil) et des plus grandes (objectif dépassé).
      for (const progress of [goal.target, goal.target + 1, goal.target + 10]) {
        const { queryByTestId } = render(
          <GoalTrackerWidget goal={goal} progress={progress} />
        )

        // Si on a atteint ou dépassé l'objectif, on n'est pas censé avoir
        // l’icône d'ajout qui trahirait un bouton de progression, mais on est
        // censé avoir l’icône de pouce vers le haut, qui traduit l’objectif (au
        // moins) atteint.
        expect(queryByTestId('in-progress')).toBeNull()
        expect(queryByTestId('completed')).not.toBeNull()

        // Dans une boucle de `render()`, il faut penser à bien démonter les
        // arbos d’un tour à l’autre pour éviter qu’elles ne s’accumulent.
        cleanup()
      }
    })

    // …valider le snapshot
    // --------------------
    // (avoir une structure détaillée identique à la dernière qui a été validée
    // par les développeurs au moyen d’un snapshot.)
    it('should otherwise match the expected snapshot', () => {
      const { container } = render(
        <GoalTrackerWidget goal={goal} progress={42} />
      )

      expect(container).toMatchSnapshot()
    })
  })
})
