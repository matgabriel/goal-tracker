import { hot } from 'react-hot-loader/root'
import React from 'react'

import ArrowForward from '@material-ui/icons/ArrowForward'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import TextField from '@material-ui/core/TextField'

import TogglablePasswordField from './TogglablePasswordField'

import './LoginScreen.styl'

const LoginScreen = () => {
  return (
    <form>
      <Card className='loginScreen'>
        <CardHeader title='Goal Tracker' subheader='Connexion' />
        <CardContent>
          <TextField
            autoComplete='home email'
            id='email'
            label='E-mail'
            fullWidth
            margin='normal'
            placeholder='mon@email.tld'
            required
            type='email'
          />
          <TogglablePasswordField
            autoComplete='current-password'
            id='password'
            label='Mot de passe'
            fullWidth
            margin='normal'
            placeholder='super mot de passe'
            required
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
}

export default hot(LoginScreen)
