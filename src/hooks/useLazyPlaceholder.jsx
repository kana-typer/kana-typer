import { lazy } from 'react'

function useLazyPlaceholder(lazyFor = 1000) {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  return lazy(() => delay(lazyFor).then(() => import('../components/Placeholder')))
}

export default useLazyPlaceholder
