import { Bath, Bed, Maximize2 } from 'lucide-react'
import { type PropertyCardProps } from '@/components/home/PropertyCard'
import styles from '@/styles/home/PropertyStrip.module.css'

interface PropertyStripProps {
  properties: PropertyCardProps[]
  onCardClick?: (index: number) => void
}

export default function PropertyStrip({ properties, onCardClick }: PropertyStripProps) {
  return (
    <div className={styles.strip}>
      {properties.map((prop, i) => (
        <div key={i} className={styles.card} onClick={() => onCardClick?.(i)}>
          <div className={styles.imageWrapper}>
            <img src={prop.image} alt={prop.title} className={styles.image} />
            <span className={styles.price}>{prop.price}</span>
          </div>
          <div className={styles.body}>
            <p className={styles.title}>{prop.title}</p>
            <p className={styles.location}>{prop.location}</p>
            <div className={styles.specs}>
              <span className={styles.spec}><Bed className={styles.specIcon} />{prop.beds}</span>
              <span className={styles.spec}><Bath className={styles.specIcon} />{prop.baths}</span>
              <span className={styles.spec}><Maximize2 className={styles.specIcon} />{prop.area}m²</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
