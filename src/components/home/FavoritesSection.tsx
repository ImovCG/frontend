import Section from '@/components/layout/Section'
import SectionHeader from '@/components/layout/SectionHeader'
import PropertyCard, { type PropertyCardProps } from '@/components/home/PropertyCard'
import styles from '@/styles/home/FavoritesSection.module.css'

interface FavoritesSectionProps {
  title: string
  subtitle?: string
  properties: PropertyCardProps[]
}

export default function FavoritesSection({ title, subtitle, properties }: FavoritesSectionProps) {
  return (
    <Section id="favoritos">
      <SectionHeader title={title} subtitle={subtitle} />
      {properties.length === 0 ? (
        <p className={styles.emptyMessage}>Você ainda não favoritou nenhum imóvel.</p>
      ) : (
        <div className={styles.grid}>
          {properties.map((prop) => (
            <PropertyCard key={prop.id} {...prop} />
          ))}
        </div>
      )}
    </Section>
  )
}
