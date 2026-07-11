import { createContext, useContext, useState, type ReactNode } from 'react'
import { PROPERTIES } from '@/data/properties'

interface FavoritesContextValue {
  isFav: (id: string) => boolean
  toggle: (id: string) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('imovcg-favorites')
      if (stored) return new Set(JSON.parse(stored) as string[])
    } catch {}
    return new Set(PROPERTIES.filter((p) => p.isFavorite).map((p) => p.id))
  })

  function toggle(id: string) {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem('imovcg-favorites', JSON.stringify([...next]))
      return next
    })
  }

  return (
    <FavoritesContext.Provider value={{ isFav: (id) => favoriteIds.has(id), toggle }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be inside FavoritesProvider')
  return ctx
}
