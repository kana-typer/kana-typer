import { useEffect, useRef, useState } from "react"

function useTimer({onStart, onStop, everySecond} = {}) {
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef(null)

  const startTimer = () => {
    if (timerRef.current)
      return

    if (onStart)
      onStart()

    timerRef.current = setInterval(() => {
      setSeconds(prevSeconds => {
        if (everySecond)
          everySecond()

        return prevSeconds + 1
      })
    }, 1000)
  }

  const stopTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = null
    if (onStop)
      onStop()
  }

  useEffect(() => {
    return () => {
      if (timerRef.current)
        clearInterval(timerRef.current)
    }
  }, [])

  return [seconds, startTimer, stopTimer]
}

export default useTimer