import { useRef, useMemo } from 'react'

function useMemoWithPreviousValue(initialValue, callback, dependencies) {
  const previousRef = useRef(initialValue)
  const memoized = useMemo(() => {
    const memoValue = callback(previousRef.current)
    previousRef.current = memoValue
    return memoValue
  }, dependencies)

  return memoized
}

export default useMemoWithPreviousValue