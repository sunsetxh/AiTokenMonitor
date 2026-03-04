import { createContext, useContext, useState, ReactNode } from 'react'

interface AppContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
  refreshKey: number
  triggerRefresh: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1)

  return (
    <AppContext.Provider
      value={{
        isLoading,
        setIsLoading,
        error,
        setError,
        refreshKey,
        triggerRefresh,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
