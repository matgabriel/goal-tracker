import { hot } from 'react-hot-loader/root'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import ArrowForward from '@material-ui/icons/ArrowForward'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import TextField from '@material-ui/core/TextField'

import { logIn } from '../reducers/currentUser'
import TogglablePasswordField from './TogglablePasswordField'

import './LoginScreen.styl'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  return (
    <form onSubmit={login}>
      <Card className='loginScreen'>
        <CardHeader title='Goal Tracker' subheader='Connexion' />
        <CardContent>
          <TextField
            autoComplete='home email'
            id='email'
            label='E-mail'
            fullWidth
            margin='normal'
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            placeholder='mon@email.tld'
            required
            type='email'
            value={email}
          />
          <TogglablePasswordField
            autoComplete='current-password'
            id='password'
            label='Mot de passe'
            fullWidth
            margin='normal'
            onChange={(e) => setPassword(e.target.value)}
            placeholder='super mot de passe'
            required
            value={password}
          />
        </CardContent>
        <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
          <Button color='primary' type='submit' variant='contained'>
            <ArrowForward />
            Connecte-toi
          </Button>
        </CardActions>
      </Card>
    </form>
  )

  function login(event) {
    event.preventDefault()
    dispatch(logIn(email, password))
  }
}

export default hot(LoginScreen)
