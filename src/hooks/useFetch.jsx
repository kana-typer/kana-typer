import { useEffect, useState } from 'react'

function useFetch({ url, auth }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const abortController = new AbortController()

    fetch(url, {
      method: 'GET',
      mode: 'cors',
      signal: abortController.signal,
      ...(auth !== undefined ? { headers: { Authorization: auth } } : {}),
    })

    return () => abortController.abort()
  }, [url])

  return data
}
