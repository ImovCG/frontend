import { Bath, Bed, Heart, MapPin, Maximize2, Phone, X } from 'lucide-react'
import { type PropertyCardProps } from '@/components/home/PropertyCard'
import { useFavorites } from '@/context/FavoritesContext'
import { cn } from '@/lib/utils'
import styles from '@/styles/home/PropertyDetail.module.css'

interface PropertyDetailProps {
  property: PropertyCardProps
  onClose: () => void
}

export default function PropertyDetail({ property, onClose }: PropertyDetailProps) {
  const { isFav, toggle } = useFavorites()
  const favorite = isFav(property.id)

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageWrapper}>
          <img src={property.image} alt={property.title} className={styles.image} />
          <button className={styles.closeBtn} onClick={onClose}>
            <X className={styles.closeIcon} />
          </button>
          <span className={styles.priceBadge}>{property.price}</span>
        </div>

        <div className={styles.body}>
          <h2 className={styles.title}>{property.title}</h2>

          <div className={styles.location}>
            <MapPin className={styles.locationIcon} />
            {property.location}
          </div>

          <div className={styles.specs}>
            <div className={styles.spec}>
              <Bed className={styles.specIcon} />
              <span>{property.beds} quartos</span>
            </div>
            <div className={styles.spec}>
              <Bath className={styles.specIcon} />
              <span>{property.baths} banheiros</span>
            </div>
            <div className={styles.spec}>
              <Maximize2 className={styles.specIcon} />
              <span>{property.area} m²</span>
            </div>
          </div>

          <p className={styles.description}>
            Imóvel bem localizado em {property.location.split(',')[0]}, com excelente acabamento,
            áreas de lazer completas e fácil acesso às principais vias da cidade.
            Documentação regularizada e pronto para financiamento.
          </p>

          <div className={styles.actions}>
            <button className={styles.btnContact}>
              <Phone className={styles.btnIcon} />
              Entrar em contato
            </button>
            <button
              className={cn(styles.btnFavorite, favorite && styles.btnFavoriteActive)}
              onClick={() => toggle(property.id)}
            >
              <Heart className={cn(styles.btnIcon, favorite && styles.heartActive)} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
