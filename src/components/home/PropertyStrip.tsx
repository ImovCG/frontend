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
  onActiveChange?: (index: number) => void
}

export default function PropertyStrip({ properties, onCardClick, onActiveChange }: PropertyStripProps) {
  const { isFav, toggle } = useFavorites()
  const stripRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  
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


  useEffect(() => {
    const root = stripRef.current
    if (!root || !onActiveChange) return

    let bestRatio = 0
    let bestIndex = -1

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const indexAttr = (entry.target as HTMLElement).dataset.index
          if (indexAttr == null) continue
          const index = Number(indexAttr)

          if (entry.isIntersecting && entry.intersectionRatio >= bestRatio) {
            bestRatio = entry.intersectionRatio
            bestIndex = index
          } else if (bestIndex === index && !entry.isIntersecting) {
            bestRatio = 0
          }
        }
        if (bestIndex >= 0) onActiveChange(bestIndex)
      },
      { root, threshold: [0.3, 0.6, 0.9] }
    )

    cardRefs.current.forEach((card) => card && observer.observe(card))
    return () => observer.disconnect()
  }, [properties, onActiveChange])

  return (
    <div ref={stripRef} className={styles.strip}>
      {properties.map((prop, i) => (
        <div
          key={prop.id}
          ref={(el) => { cardRefs.current[i] = el }}
          data-index={i}
          className={styles.card}
          onClick={() => onCardClick?.(i)}
        >
          <div className={styles.imageWrapper}>
            <img src={prop.image} alt={prop.title} className={styles.image} referrerPolicy="no-referrer" />
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
            {prop.description && (
              <p className={styles.description}>{prop.description}</p>
            )}
            <div className={styles.specs}>
              <span className={styles.spec}><Bed className={styles.specIcon} />{prop.beds}</span>
              <span className={styles.spec}><Bath className={styles.specIcon} />{prop.baths}</span>
              <span className={styles.spec}><Maximize2 className={styles.specIcon} />{prop.area}m²</span>
            </div>
            <div className={styles.actions}>
              <PropertyActions
                tipoAnuncio={prop.tipoAnuncio}
                sourceUrl={prop.sourceUrl}
                viewClassName={styles.viewBtn}
                badgeClassName={styles.statusBtn}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
