import { useEffect, useRef } from 'react'
import { Bath, Bed, Heart, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type PropertyCardProps } from '@/components/home/PropertyCard'
import PropertyActions from '@/components/home/PropertyActions'
import { useFavorites } from '@/context/FavoritesContext'
import styles from '@/styles/home/PropertyStrip.module.css'

interface PropertyStripProps {
  properties: PropertyCardProps[]
  onCardClick?: (index: number) => void
}

export default function PropertyStrip({ properties, onCardClick }: PropertyStripProps) {
  const { isFav, toggle } = useFavorites()
  const stripRef = useRef<HTMLDivElement>(null)

  // Mouse wheel scrolls vertically by default; translate it into horizontal
  // scroll here so desktop users (not just touch/trackpad) can scroll the strip.
  useEffect(() => {
    const el = stripRef.current
    if (!el) return

    function handleWheel(e: WheelEvent) {
      if (e.deltaY === 0) return
      e.preventDefault()
      el!.scrollLeft += e.deltaY
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div ref={stripRef} className={styles.strip}>
      {properties.map((prop, i) => (
        <div key={prop.id} className={styles.card} onClick={() => onCardClick?.(i)}>
          <div className={styles.imageWrapper}>
            <img src={prop.image} alt={prop.title} className={styles.image} />
            <span className={styles.price}>{prop.price}</span>
            <button
              className={styles.favoriteBtn}
              onClick={(e) => { e.stopPropagation(); toggle(prop.id) }}
              aria-label={isFav(prop.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
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
              <PropertyActions
                status={prop.status ?? 'Disponível'}
                sourceUrl={prop.sourceUrl}
                viewClassName={styles.viewBtn}
                statusClassName={styles.statusBtn}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
