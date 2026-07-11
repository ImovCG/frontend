import { Bath, Bed, Heart, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/context/FavoritesContext'
import { type PropertyStatus } from '@/lib/property'
import PropertyActions from '@/components/home/PropertyActions'
import styles from '@/styles/home/PropertyCard.module.css'

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
  status?: PropertyStatus
  sourceUrl?: string
  onClick?: () => void
  variant?: 'default' | 'favorites'
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
  variant = 'default',
}: PropertyCardProps) {
  const { isFav, toggle } = useFavorites()
  const favorite = isFav(id)
  const isFavorites = variant === 'favorites'

  return (
    <div className={cn(styles.card, isFavorites && styles.cardFavorites)} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} />
        <button
          className={cn(styles.favoriteBtn, isFavorites && styles.favoriteBtnFavorites)}
          onClick={(e) => { e.stopPropagation(); toggle(id) }}
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={cn(styles.heartIcon, isFavorites && styles.heartIconFavorites, favorite && styles.heartActive)} />
        </button>
      </div>
      <div className={cn(styles.body, isFavorites && styles.bodyFavorites)}>
        <p className={cn(styles.price, isFavorites && styles.priceFavorites)}>{price}</p>
        <h3 className={cn(styles.title, isFavorites && styles.titleFavorites)}>{title}</h3>
        <p className={cn(styles.location, isFavorites && styles.locationFavorites)}>{location}</p>
        <div className={cn(styles.specs, isFavorites && styles.specsFavorites)}>
          <span className={styles.specItem}><Bed className={styles.specIcon} />{beds}</span>
          <span className={styles.specItem}><Bath className={styles.specIcon} />{baths}</span>
          <span className={styles.specItem}><Maximize2 className={styles.specIcon} />{area}m²</span>
        </div>
        <div className={styles.actions}>
          <PropertyActions
            status={status}
            sourceUrl={sourceUrl}
            viewClassName={cn(styles.viewBtn, isFavorites && styles.viewBtnFavorites)}
            statusClassName={cn(styles.statusBtn, isFavorites && styles.statusBtnFavorites)}
          />
        </div>
      </div>
    </div>
  )
}
