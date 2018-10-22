import { hot } from 'react-hot-loader/root'
import React from 'react'

import Add from '@material-ui/icons/Add'
import Fab from '@material-ui/core/Fab'
import ThumbUp from '@material-ui/icons/ThumbUp'
import Typography from '@material-ui/core/Typography'

import { func, GoalPropType, nonNegativeInteger } from '../shared/prop-types'
import Gauge from '../shared/Gauge'

const GoalTrackerWidget = ({
  goal,
  goal: { name, units, target },
  onProgress,
  progress,
}) => {
  const adderComponent =
    target > progress ? (
      <Fab
        color='secondary'
        onClick={() => onProgress && onProgress(goal)}
        size='small'
      >
        <Add data-testid='in-progress' />
      </Fab>
    ) : (
      <Fab disabled size='small'>
        <ThumbUp data-testid='completed' />
      </Fab>
    )

  return (
    <div className='goal'>
      <div className='summary'>
        <Typography variant='h6' component='h2'>
          {name}
        </Typography>
        <Gauge value={progress} max={target} />
        <Typography component='small'>
          {`${progress} ${units} sur ${target}`}
        </Typography>
      </div>
      <div className='cta'>{adderComponent}</div>
    </div>
  )
}

// Comme toujours, on définit les propriétés attendues/autorisées pour
// validation.
GoalTrackerWidget.propTypes = {
  goal: GoalPropType.isRequired,
  progress: nonNegativeInteger.isRequired,
  onProgress: func,
}

export default hot(GoalTrackerWidget)
