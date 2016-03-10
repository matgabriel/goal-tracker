// Écran de suivi des objectifs
// ============================

import { hot } from 'react-hot-loader/root'
import { Link } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import HistoryIcon from '@material-ui/icons/History'
import SettingsIcon from '@material-ui/icons/Settings'

import { formatDate, getDayCounts } from '../lib/helpers'
import Gauge from '../shared/Gauge'
import GoalTrackerWidget from './GoalTrackerWidget'
import { progressOnGoal } from '../reducers/todaysProgress'

// Remarquez l’injection CSS à la volée, depuis une feuille de style Stylus, via
// un simple import.  C’est grâce à la combinaison de plusieurs loaders Webpack
// : `stylus-loader`, pour transformer Stylus en CSS classique, `css-loader`,
// qui transforme la CSS en module JS avec exports des règles, et
// `style-loader`, qui va injecter ces règles à la volée dans le DOM, sur les
// éléments concernés, garantissant leur application quel que soit le contexte.
//
// En mode production, on configure le `MiniCssExtractPlugin` pour sortir toutes
// les CSS issues de feuilles autonomes en un seul fichier CSS optimisé, pour
// permettre l’application de styles dès le chargement, sans attendre que JS
// s’exécute.
import './TrackerScreen.styl'

const TrackerScreen = () => {
  // Au premier rendu, on ajuste le titre du document pour permettre un
  // historique de navigation utilisable (et pas une tonne de titres
  // identiques).  Le [deuxième
  // argument](https://fr.reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect)
  // est le tableau de dépendances qui indique quand relancer l’effet : comme il
  // est vide, seul le premier rendu du composant est concerné.
  useEffect(() => {
    document.title = 'Mes objectifs du jour'
  }, [])

  // On s’intéresse uniquement aux champs `goals`, `today` et `todaysProgress`
  // de l’état global, qu’on veut retrouver dans nos propriétés sous les mêmes
  // noms.  Par ricochet, seuls les changements apportés à ces champs
  // entraîneront un éventuel *re-render* de notre conteneur.  La fonction
  // `selectState`, qui va chercher ces infos, est plus bas dans le fichier.
  const { goals, today, todaysProgress } = useSelector(selectState)
  // Vu qu’on va solliciter le *store* pour faire progresser les objectifs, on a
  // besoin de `dispatch` afin de lui envoyer une action.
  const dispatch = useDispatch()

  return (
    <Card className='goalTracker'>
      <CardHeader
        subheader={<Gauge {...overallProgress()} />}
        title={formatDate(today, 'medium')}
      />
      <CardContent>
        {goals.map((goal) => (
          <GoalTrackerWidget
            goal={goal}
            key={goal.id}
            onProgress={markGoalProgression}
            progress={todaysProgress[goal.id] || 0}
          />
        ))}
      </CardContent>
      <CardActions>
        <Button
          color='secondary'
          component={Link}
          to='/history'
          variant='contained'
        >
          <HistoryIcon /> Historique
        </Button>
        <Button component={Link} to='/settings' variant='contained'>
          <SettingsIcon /> Paramètres
        </Button>
      </CardActions>
    </Card>
  )

  // Callback pour le `onProgress` des `<GoalTrackerWidget />` qui va déclencher
  // la progression de l’objectif dans l’état global applicatif.
  function markGoalProgression({ id }) {
    dispatch(progressOnGoal(id))
  }

  // Petite méthode métier calculant notre pourcentage global d’accomplissement
  // des objectifs quotidiens.
  function overallProgress() {
    const { totalProgress, totalTarget } = getDayCounts(todaysProgress, goals)

    return { value: totalProgress, max: totalTarget }
  }
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
const selectState = ({ goals, today, todaysProgress }) => ({
  goals,
  today,
  todaysProgress,
})

export default hot(TrackerScreen)
