import { useEffect, useRef, useState } from 'react'

/**
 * Sets an interval to run every second. Starts immediately after calling start function and thus it seems like it will start from `initialSeconds - 1`.
 * @param {number} initialSeconds - specifies how long to run counter in seconds. Starts immediately, updating count to `initialSeconds - 1` and does last run at == 0.
 * @param {() => void} onStart - function to run immediately at start of the counter
 * @param {() => void} onComplete - function to run when interval finishes and is being cleared
 * @returns {[number, () => void]} [seconds - current count of seconds, startCountdown - function that starts the countdown]
 */
function useCountdown(initialSeconds, onStart, onComplete) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const timerRef = useRef(null)

  const countSecond = () => {
    setSeconds(prevSeconds => {
      if (onStart && prevSeconds >= initialSeconds)
        onStart()

      if (prevSeconds > 1)
        return prevSeconds - 1

      clearInterval(timerRef.current)
      timerRef.current = null

      if (onComplete)
        onComplete()

      return 0
    })
  }

  const startCountdown = () => {
    if (timerRef.current)
      return

    countSecond()
    timerRef.current = setInterval(countSecond, 1000)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current)
        clearInterval(timerRef.current)
    }
  }, [])

  return [seconds, startCountdown]
}

export default useCountdown