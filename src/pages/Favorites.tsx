import { PROPERTIES } from '@/data/properties'
import { useFavorites } from '@/context/FavoritesContext'
import FavoritesSection from '@/components/home/FavoritesSection'

export default function Favorites() {
  const { isFav } = useFavorites()
  const favorites = PROPERTIES.filter((p) => isFav(p.id))

  return (
    <FavoritesSection
      title="Meus Favoritos"
      subtitle="Imóveis que você marcou para acompanhar de perto."
      properties={favorites}
    />
  )
}
