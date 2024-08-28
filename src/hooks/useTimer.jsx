import { useEffect, useRef, useState } from "react"

function useTimer(initialSeconds, onStart, onComplete) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const timerRef = useRef(null)

  const startTimer = () => {
    if (timerRef.current)
      return

    onStart()

    timerRef.current = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds > 0)
          return prevSeconds - 1

        clearInterval(timerRef.current)
        timerRef.current = null
        if (onComplete)
          onComplete()
        return 0
      })
    }, 1000)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current)
        clearInterval(timerRef.current)
    }
  }, [])

  return [seconds, startTimer]
}

export default useTimer