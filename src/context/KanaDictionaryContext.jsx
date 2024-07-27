import { createContext, useContext, useState, useEffect } from 'react'

const KanaDictionaryContext = createContext(null)

export default function KanaDictionaryProvider({ children }) {
  const [kanaDictionary, setKanaDictionary] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const getKana = () => {
    
  }

  const providerValues = {
    getKana: getKana
  }

  useEffect(() => {
    setIsLoading(false)
    // setKanaDictionary(() => ())
  }, [])

  return (
    <KanaDictionaryContext.Provider value={providerValues}>
      {children}
    </KanaDictionaryContext.Provider>
  )
}

export const useKanaDictionaryProvider = () => useContext(KanaDictionaryContext)
