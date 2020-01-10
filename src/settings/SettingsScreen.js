import { hot } from 'react-hot-loader/root'
import { Link } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Add from '@material-ui/icons/Add'
import ArrowBack from '@material-ui/icons/ArrowBack'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Logout from '@material-ui/icons/ExitToApp'
import Typography from '@material-ui/core/Typography'

// import { removeGoal } from '../reducers/goals'
// import DeleteSettingDialog from './DeleteSettingDialog'
import GoalSetting from './GoalSetting'
import { logOut } from '../reducers/currentUser'

const SettingsScreen = () => {
  useEffect(() => {
    document.title = 'Mes paramètres'
  }, [])

  const { goals, email } = useSelector(selectState)
  const dispatch = useDispatch()

  return (
    <>
      <Button component={Link} to='/' variant='text'>
        <ArrowBack />
        Retour
      </Button>
      <Card className='settings'>
        <CardHeader title='Paramètres' />
        <CardContent>
          <List>
            <ListItem>
              <ListItemText
                primary='Vous êtes connecté-e en tant que'
                secondary={email}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => dispatch(logOut())}>
                  <Logout />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
          <Divider />
          <List>
            <Typography variant='subtitle1'>Mes objectifs</Typography>
            {goals.map((goal) => (
              <GoalSetting goal={goal} key={goal.id} />
            ))}
            {goals.length === 0 && (
              <ListItem>
                <ListItemText secondary='Aucun objectif pour le moment' />
              </ListItem>
            )}
          </List>
        </CardContent>
        <CardActions>
          <Button color='primary' variant='contained'>
            <Add />
            Ajouter un objectif
          </Button>
        </CardActions>
      </Card>
    </>
  )
}

const selectState = ({ goals, currentUser: { email } }) => ({ goals, email })

export default hot(SettingsScreen)
