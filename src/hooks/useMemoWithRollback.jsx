import { useRef, useMemo } from 'react'

function useMemoWithRollback(initialValue, callback, dependencies) {
  const rollback = useRef(initialValue)
  const memoized = useMemo(() => {
    const { memo: newMemo, rollback: newRollback } = callback(rollback.current)

    if (newRollback !== undefined)
      rollback.current = newRollback

    return newMemo
  }, dependencies)

  return memoized
}

export default useMemoWithRollback