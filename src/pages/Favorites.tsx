import { useState } from 'react'
import { PROPERTIES } from '@/data/properties'
import { useFavorites } from '@/context/FavoritesContext'
import { FavoritesHeader } from '@/components/home/FavoritesHeader'
import FavoritesSection from '@/components/home/FavoritesSection'
import PropertyDetail from '@/components/home/PropertyDetail'
import { type PropertyCardProps } from '@/components/home/PropertyCard'

export default function Favorites() {
  const { isFav } = useFavorites()
  const favorites = PROPERTIES.filter((p) => isFav(p.id))
  const [selectedProperty, setSelectedProperty] = useState<PropertyCardProps | null>(null)

  return (
    <>
      <FavoritesSection
        header={<FavoritesHeader count={favorites.length} />}
        properties={favorites}
        onCardClick={(id) => setSelectedProperty(favorites.find((p) => p.id === id) ?? null)}
      />

      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </>
  )
}
