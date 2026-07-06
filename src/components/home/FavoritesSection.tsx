import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import Section from '@/components/layout/Section'
import SectionHeader from '@/components/layout/SectionHeader'
import PropertyCard, { type PropertyCardProps } from '@/components/home/PropertyCard'
import styles from '@/styles/home/FavoritesSection.module.css'

interface FavoritesSectionProps {
  title: string
  subtitle?: string
  properties: PropertyCardProps[]
  onCardClick?: (id: string) => void
}

export default function FavoritesSection({ title, subtitle, properties, onCardClick }: FavoritesSectionProps) {
  return (
    <Section id="favoritos">
      <SectionHeader title={title} subtitle={subtitle} />
      {properties.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <Heart className={styles.emptyIconGlyph} />
          </span>
          <h3 className={styles.emptyTitle}>Nenhum favorito ainda</h3>
          <p className={styles.emptyText}>
            Explore os imóveis disponíveis e toque no coração pra salvar os que você mais gostou.
          </p>
          <Link to="/" className={styles.emptyCta}>Explorar imóveis</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {properties.map((prop) => (
            <PropertyCard key={prop.id} {...prop} onClick={() => onCardClick?.(prop.id)} />
          ))}
        </div>
      )}
    </Section>
  )
}
