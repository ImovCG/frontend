import { Bath, Bed, Heart, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type PropertyCardProps, FALLBACK_SOURCE_URL } from '@/components/home/PropertyCard'
import { useFavorites } from '@/context/FavoritesContext'
import styles from '@/styles/home/PropertyStrip.module.css'

interface PropertyStripProps {
  properties: PropertyCardProps[]
  onCardClick?: (index: number) => void
}

export default function PropertyStrip({ properties, onCardClick }: PropertyStripProps) {
  const { isFav, toggle } = useFavorites()

  return (
    <div className={styles.strip}>
      {properties.map((prop, i) => (
        <div key={prop.id} className={styles.card} onClick={() => onCardClick?.(i)}>
          <div className={styles.imageWrapper}>
            <img src={prop.image} alt={prop.title} className={styles.image} />
            <span className={styles.price}>{prop.price}</span>
            <button
              className={styles.favoriteBtn}
              onClick={(e) => { e.stopPropagation(); toggle(prop.id) }}
            >
              <Heart className={cn(styles.heartIcon, isFav(prop.id) && styles.heartActive)} />
            </button>
          </div>
          <div className={styles.body}>
            <p className={styles.title}>{prop.title}</p>
            <p className={styles.location}>{prop.location}</p>
            <div className={styles.specs}>
              <span className={styles.spec}><Bed className={styles.specIcon} />{prop.beds}</span>
              <span className={styles.spec}><Bath className={styles.specIcon} />{prop.baths}</span>
              <span className={styles.spec}><Maximize2 className={styles.specIcon} />{prop.area}m²</span>
            </div>
            <div className={styles.actions}>
              <button
                className={styles.viewBtn}
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(prop.sourceUrl || FALLBACK_SOURCE_URL, '_blank', 'noopener,noreferrer')
                }}
              >
                Ver anúncio
              </button>
              <span className={styles.statusBtn}>{prop.status ?? 'Disponível'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
