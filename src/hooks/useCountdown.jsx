import { useEffect, useRef, useState } from "react"

function useCountdown(initialSeconds, onStart, onComplete) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const timerRef = useRef(null)

  const startCountdown = () => {
    if (timerRef.current)
      return

    if (onStart)
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

  return [seconds, startCountdown]
}

export default useCountdown