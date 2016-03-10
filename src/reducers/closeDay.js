// Fermeture de journée (reducer)
// ==============================

// *(Structuration de type
// [Ducks](https://github.com/erikras/ducks-modular-redux))*

import { isoDate } from '../lib/helpers'

// Types d’actions
// ---------------

const CLOSE_DAY = 'goal-tracker/closeDay/CLOSE_DAY'

// Réducteur
// ---------

// La valeur par défaut est gérée par le meta-réducteur dans `index.js`
export default function reduceCloseDay(state, action) {
  switch (action.type) {
    case CLOSE_DAY:
      return {
        // On garde l'état d'origine, en écrasant toutefois trois champs :
        ...state,
        // * `history` (on ajoute une entrée pour le `today` précédent)
        history: tallyPreviousDay(state),
        // * `today` (la journée “active” se recale sur aujourd'hui)
        today: isoDate(new Date()),
        todaysProgress: {},
      }

    default:
      return state
  }
}

// Action Creators
// ---------------

export function closeDay() {
  return { type: CLOSE_DAY }
}

// Calcul de l’historisation
// -------------------------

function tallyPreviousDay({ goals, history, today, todaysProgress }) {
  const progresses = {}
  for (const { id, target } of goals) {
    const progress = todaysProgress[id] || 0
    // On n’historise que les progrès non nuls…
    if (progress > 0) {
      // On n’oublie pas de préciser la valeur cible en vigueur, des fois
      // qu’elle changerait par la suite.
      progresses[id] = [progress, target]
    }
  }

  const historyEntry = {
    // À ce stade, `today` n’a pas encore été modifié, il vaut le dernier jour
    // pris en compte par l’état.  Il sert donc pour la date de l’entrée dans
    // l’historique.
    date: today,
    progresses,
  }

  // Inutile de créer des entrées d’historique vides (zéro progrès ce jour-là)
  const hasProgresses = Object.keys(historyEntry.progresses).length > 0
  // …et comme d’habitude, la version non-modifiante de `push`, en tout cas si
  // on a quelque chose à historiser
  return hasProgresses ? [historyEntry, ...history] : history
}
