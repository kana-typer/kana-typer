import { useEffect } from 'react'

import useTimer from '../../../hooks/useTimer'

import { getPercFromValue } from '../../../utils/math'

import '../css/Stats.css'

function Stats({ correctHits, incorrectHits, isStarted, isFinished }) {
  const [seconds, startTimer, stopTimer] = useTimer({ 
    everySecond: () => {
      if (isStarted && !isFinished) {
        // TODO: update stats
        // TODO: better way would be to wait for countdown end (if it was set) or kana unload or move to next page to specify when stat update is being processed
      }
    }
  })

  const correct = Object.values(correctHits).length
  const incorrect = Object.values(incorrectHits).length
  const wordsSum = correct + incorrect
  const accuracy = getPercFromValue(correct, wordsSum === 0 ? 1 : wordsSum)
  const wordsPerMinute = seconds === 0 ? 0 : wordsSum / (seconds / 60)

  useEffect(() => {
    if (isStarted)
      startTimer()

    if (isFinished)
      stopTimer()
  }, [isStarted, isFinished])

  return (
    <div className='stats'>
      <table>
        <tbody>
          <tr>
            <td>Correct / Mistakes</td>
            <td>{`${correct} / ${incorrect}`}</td>
          </tr>
          <tr>
            <td>Accuracy</td>
            <td>{accuracy.toFixed(2)}%</td>
          </tr>
          <tr>
            <td>Words per minute</td>
            <td>{wordsPerMinute.toFixed(0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Stats