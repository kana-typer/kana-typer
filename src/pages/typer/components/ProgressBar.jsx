import React, { useEffect, useMemo } from 'react'

import { getPercFromValue } from '../../../utils/math'

import '../css/ProgressBar.css'

function ProgressBar({ timer, maxTimer, isFinished, hueStart = 110, hueEnd = 10 }) {
  const percentage = useMemo(() => getPercFromValue(timer, maxTimer), [timer])

  const icon = useMemo(() => {
    if (isFinished)
      return '😿'

    if (percentage > 66)
      return '😸'

    if (percentage > 33)
      return '😾'

    return '🙀'
  }, [percentage, isFinished])

  const hue = useMemo(() => hueEnd + ((hueStart - hueEnd) * percentage / 100), [percentage])

  return (
    <div className='progress-bar'>
      <div className='bar' style={{ 
        width: `${percentage}%`,
        backgroundColor: `hsl(${hue}, 100%, 40%)`,
      }}>
        <span className='icon'>{icon}</span>
      </div>
    </div>
  )
}

export default ProgressBar