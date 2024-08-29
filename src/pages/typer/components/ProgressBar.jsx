import React, { useMemo } from 'react'

import { getPercFromValue } from '../../../utils/math'

import '../css/ProgressBar.css'

function ProgressBar({ timer, maxTimer, isFinished }) {
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

  // TODO: hue boundaries are [10, 110] - implement it somehow
  // or maybe just add better hsl support down in the styles?
  const hue = useMemo(() => getPercFromValue(timer - maxTimer, maxTimer) + 110, [timer])

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