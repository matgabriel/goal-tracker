import { hot } from 'react-hot-loader/root'
import React from 'react'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import HistoryIcon from '@material-ui/icons/History'
import SettingsIcon from '@material-ui/icons/Settings'

import { formatDate, getDayCounts } from '../lib/helpers'
import Gauge from '../shared/Gauge'
import store from '../store'

import './TrackerScreen.styl'

const TrackerScreen = () => {
  const { goals, today, todaysProgress } = store
  return (
    <Card className='goalTracker'>
      <CardHeader
        subheader={<Gauge {...overallProgress()} />}
        title={formatDate(today, 'medium')}
      />
      <CardContent>FIXME</CardContent>
      <CardActions>
        <Button color='secondary' variant='contained'>
          <HistoryIcon /> Historique
        </Button>
        <Button variant='contained'>
          <SettingsIcon /> Paramètres
        </Button>
      </CardActions>
    </Card>
  )

  function overallProgress() {
    const { totalProgress, totalTarget } = getDayCounts(todaysProgress, goals)

    return { value: totalProgress, max: totalTarget }
  }
}

export default hot(TrackerScreen)
