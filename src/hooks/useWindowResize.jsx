import { useCallback, useEffect } from 'react'

/**
 * Listens on `resize` event calls and forwards callback to it. Also runs on any change to callback function, e.g. page refresh. Memoize the callback to prevent unwanted re-runs and re-attachments of `resize` event listeners.
 * @param {*} callback 
 * @returns {{ width: number, height: number }} current size of window
 */
function useWindowResize(callback) {
  const onResize = useCallback((event) => {
    if (callback)
      callback({ width: window.innerWidth, height: window.innerHeight }, event)
  }, [callback])

  useEffect(() => {
    window.addEventListener('resize', onResize)

    onResize()

    return () => window.removeEventListener('resize', onResize)
  }, [callback])
}

export default useWindowResize