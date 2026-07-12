import { useMemo, useState } from 'react'
import { useFavorites } from '@/context/FavoritesContext'
import { FavoritesHeader } from '@/components/home/FavoritesHeader'
import FavoritesSection from '@/components/home/FavoritesSection'
import PropertyDetail from '@/components/home/PropertyDetail'
import { type PropertyCardProps } from '@/components/home/PropertyCard'
import { useImoveis } from '@/hooks/useImoveis'

export default function Favorites() {
  const { isFav } = useFavorites()
  const { properties, loading, error, refetch } = useImoveis({ size: 200 })
  const [selectedProperty, setSelectedProperty] = useState<PropertyCardProps | null>(null)

  const favorites = useMemo(
    () => properties.filter((p) => isFav(p.id)),
    [properties, isFav],
  )

  return (
    <>
      {loading ? (
        <p style={{ padding: '2rem', textAlign: 'center' }}>Carregando favoritos...</p>
      ) : error ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>{error}</p>
          <button type="button" onClick={refetch}>Tentar novamente</button>
        </div>
      ) : (
        <FavoritesSection
          header={<FavoritesHeader count={favorites.length} />}
          properties={favorites}
          onCardClick={(id) => setSelectedProperty(favorites.find((p) => p.id === id) ?? null)}
        />
      )}

      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </>
  )
}
