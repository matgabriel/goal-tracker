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
  useEffect(() => {
    document.title = 'Mon historique'
  }, [])

  const { goals, history } = useSelector(selectState)
  const dispatch = useDispatch()

  return (
    <>
      <Button component={Link} to='/' variant='text'>
        <ArrowBack />
        Retour
      </Button>
      <Card className='history'>
        <CardHeader title='Historique' />
        <CardContent>
          <Typography>Coming soon: history</Typography>
        </CardContent>
        <CardActions>
          <Button variant='contained'>
            <ClearIcon />
            Réinitialiser
          </Button>
        </CardActions>
      </Card>
    </>
  )
}

const selectState = ({ goals, history }) => ({ goals, history })

export default hot(HistoryScreen)
