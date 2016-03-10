// Historique (conteneur)
// ======================

import { hot } from 'react-hot-loader/root'
import { Link } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ArrowBack from '@material-ui/icons/ArrowBack'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import ClearIcon from '@material-ui/icons/Clear'
import Typography from '@material-ui/core/Typography'

import { clearHistory } from '../reducers/history'
import HistoryDay from './HistoryDay'

export const HistoryScreen = () => {
  // Au premier rendu, on ajuste le titre du document pour permettre un
  // historique de navigation utilisable (et pas une tonne de titres
  // identiques).  Le [deuxième
  // argument](https://fr.reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)
  // est le tableau de dépendances qui indique quand relancer l’effet : comme il
  // est vide, seul le premier rendu du composant est concerné.
  useEffect(() => {
    document.title = 'Mon historique'
  }, [])

  // On s’intéresse uniquement aux champs `goals` et `history` de l’état global,
  // qu’on veut retrouver dans nos propriétés sous les mêmes noms.  Par
  // ricochet, seuls les changements apportés à ces champs entraîneront un
  // éventuel *re-render* de notre conteneur.  La fonction `selectState`, qui va
  // chercher ces infos, est plus bas dans le fichier.
  const { goals, history } = useSelector(selectState)
  // Vu qu’on va solliciter le *store* pour déclencher l’effacement de
  // l’historique, on a besoin de `dispatch` afin de lui envoyer une action.
  const dispatch = useDispatch()

  return (
    // Quand on fait un bouton destiné à être en fait un lien, surtout au sein
    // d’un [`<Link>`](https://reacttraining.com/react-router/web/api/Link), on
    // utilise la propriété
    // [`component`](https://material-ui.com/api/button/#props) pour altérer le
    // composant représentant la couche extérieure du bouton (en lieu et place
    // de `button`).  Les *props* non utilisées par `Button` sont alors passées
    // telles quelles à ce composant (ici la *prop* `to`).
    <>
      <Button component={Link} to='/' variant='text'>
        <ArrowBack />
        Retour
      </Button>
      <Card className='history'>
        <CardHeader title='Historique' />
        <CardContent>
          {history.map((dayStats) => (
            // Pensez bien à toujours définir une association unique et *stable*
            // entre l’objet de base et son composant au sein d’un `map`, [grâce
            // à la propriété
            // `key`](https://fr.reactjs.org/docs/lists-and-keys.html#keys).
            // Sinon, React va s’emmêler les pinceaux quand le tableau
            // sous-jacent change (suppression, réordonnancement…).
            <HistoryDay goals={goals} key={dayStats.date} stats={dayStats} />
          ))}
          {// Ici en revanche, on a l’exemple classique du “if”
          // [façon
          // JSX](https://fr.reactjs.org/docs/conditional-rendering.html#inline-if-with-logical--operator)
          // : une condition suivie d’un et (`&&`) et du composant.  Si on avait
          // un `else` en plus, on préfèrerait un ternaire avec éventuellement
          // des parenthèses autour de chaque partie si au moins l’une d’elles
          // est multi-lignes.  Voir à ce sujet [Affichage
          // conditionnel](https://fr.reactjs.org/docs/conditional-rendering.html#inline-if-else-with-conditional-operator).
          history.length === 0 && (
            <Typography>Aucun historique disponible</Typography>
          )}
        </CardContent>
        {history.length > 0 && (
          <CardActions>
            <Button
              variant='contained'
              onClick={() => dispatch(clearHistory())}
            >
              <ClearIcon />
              Réinitialiser
            </Button>
          </CardActions>
        )}
      </Card>
    </>
  )
}

// Fonction de sélection des valeurs utiles au composant au sein de l’état
// global applicatif géré par Redux.  L’argument est l’état global applicatif
// dans son intégralité, la valeur de retour sera celle renvoyée par le
// [`useSelector()`](https://react-redux.js.org/api/hooks#useselector) auquel on
// aura passé cette fonction.
//
// Ici, on renvoie un sous-ensemble de l’état global, sans altérer les valeurs
// des propriétés retenues (comme un
// [`_.pick()`](https://lodash.com/docs/#pick)), donc on renvoie un littéral
// objet avec ces propriétés-là.  Attention à la syntaxe : à gauche de la
// flèche, on a la signature de la fonction, qui déstructure son argument objet
// pour y prendre deux propriétés ; à droite de la flèche, on a un littéral
// objet, qu’on a dû enrober par des parenthèses pour que les accolades, étant
// ainsi forcées d’être une expression et non un bloc de fonction, représentent
// bien un littéral objet.
const selectState = ({ goals, history }) => ({ goals, history })

export default hot(HistoryScreen)
