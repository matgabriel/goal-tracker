// Jauge
// =====
//
// Réutilisé absolument partout dans l’application…  Un parfait exemple de
// composant réutilisable, du coup !

import { hot } from 'react-hot-loader/root'
import React from 'react'

import LinearProgress from '@material-ui/core/LinearProgress'

import { nonNegativeInteger, positiveInteger } from '../shared/prop-types'

const Gauge = ({ max, value }) => {
  return (
    <LinearProgress
      style={{ height: 8 }}
      variant='determinate'
      value={normalize(value, max)}
    />
  )
}

// En définissant les valeurs par défaut dans `defaultProps` au lieu des valeurs
// par défaut de la signature, on s’assure qu’elles seront bien prises en compte
// avant l’exploitation des `propTypes` ci-après.
Gauge.defaultProps = {
  max: 100,
}

// Comme toujours, on définit les propriétés attendues/autorisées pour
// validation.
Gauge.propTypes = {
  max: positiveInteger,
  value: nonNegativeInteger.isRequired,
}

function normalize(value, max) {
  return value * (100 / max)
}

export default hot(Gauge)
