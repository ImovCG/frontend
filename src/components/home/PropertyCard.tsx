import { Bath, Bed, Heart, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import styles from '@/styles/home/PropertyCard.module.css'

export interface PropertyCardProps {
  image: string
  title: string
  price: string
  location: string
  beds: number
  baths: number
  area: number
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  onClick?: () => void
}

export default function PropertyCard({
  image,
  title,
  price,
  location,
  beds,
  baths,
  area,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
}: PropertyCardProps) {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} />
        <button
          className={styles.favoriteBtn}
          onClick={(e) => {
            e.stopPropagation()
            onFavoriteToggle?.()
          }}
        >
          <Heart className={cn(styles.heartIcon, isFavorite && styles.heartActive)} />
        </button>
      </div>
      <div className={styles.body}>
        <p className={styles.price}>{price}</p>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.location}>{location}</p>
        <div className={styles.specs}>
          <span className={styles.specItem}>
            <Bed className={styles.specIcon} />
            {beds}
          </span>
          <span className={styles.specItem}>
            <Bath className={styles.specIcon} />
            {baths}
          </span>
          <span className={styles.specItem}>
            <Maximize2 className={styles.specIcon} />
            {area}m²
          </span>
        </div>
      </div>
    </div>
  )
}
