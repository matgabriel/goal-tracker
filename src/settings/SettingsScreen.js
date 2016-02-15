import { hot } from 'react-hot-loader/root'
import React, { useEffect } from 'react'

export const SettingsScreen = () => {
  useEffect(() => {
    document.title = 'Mes paramètres'
  }, [])

  return <h1>Settings coming soon</h1>
}

export default hot(SettingsScreen)
