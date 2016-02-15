import { hot } from 'react-hot-loader/root'
import React, { useEffect } from 'react'

export const HistoryScreen = () => {
  useEffect(() => {
    document.title = 'Mon historique'
  }, [])

  return <h1>History coming soon</h1>
}

export default hot(HistoryScreen)
