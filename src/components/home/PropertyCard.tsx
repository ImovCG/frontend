import { Bath, Bed, Heart, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/context/FavoritesContext'
import styles from '@/styles/home/PropertyCard.module.css'

// TODO: remover fallback quando webscraping preencher sourceUrl real por imóvel
export const FALLBACK_SOURCE_URL = 'https://www.olx.com.br'

export interface PropertyCardProps {
  id: string
  image: string
  title: string
  price: string
  location: string
  beds: number
  baths: number
  area: number
  lat?: number
  lng?: number
  neighborhoodId?: string
  isFavorite?: boolean
  status?: string
  sourceUrl?: string
  onClick?: () => void
}

export default function PropertyCard({
  id,
  image,
  title,
  price,
  location,
  beds,
  baths,
  area,
  status = 'Disponível',
  sourceUrl,
  onClick,
}: PropertyCardProps) {
  const { isFav, toggle } = useFavorites()
  const favorite = isFav(id)

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} />
        <button
          className={styles.favoriteBtn}
          onClick={(e) => { e.stopPropagation(); toggle(id) }}
        >
          <Heart className={cn(styles.heartIcon, favorite && styles.heartActive)} />
        </button>
      </div>
      <div className={styles.body}>
        <p className={styles.price}>{price}</p>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.location}>{location}</p>
        <div className={styles.specs}>
          <span className={styles.specItem}><Bed className={styles.specIcon} />{beds}</span>
          <span className={styles.specItem}><Bath className={styles.specIcon} />{baths}</span>
          <span className={styles.specItem}><Maximize2 className={styles.specIcon} />{area}m²</span>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.viewBtn}
            onClick={(e) => {
              e.stopPropagation()
              window.open(sourceUrl || FALLBACK_SOURCE_URL, '_blank', 'noopener,noreferrer')
            }}
          >
            Ver anúncio
          </button>
          <span className={styles.statusBtn}>{status}</span>
        </div>
      </div>
    </div>
  )
}
