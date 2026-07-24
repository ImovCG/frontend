import { useState } from 'react'
import { Bath, Bed, Heart, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLACEHOLDER_IMAGE } from '@/lib/imovelMapper'
import { useFavorites } from '@/context/FavoritesContext'
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
  tipoAnuncio?: string
  sourceUrl?: string
  description?: string
  categoria?: string
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
  tipoAnuncio,
  sourceUrl,
  onClick,
  variant = 'default',
}: PropertyCardProps) {
  const { isFav, toggle } = useFavorites()
  const favorite = isFav(id)
  const isFavorites = variant === 'favorites'
  const [imageError, setImageError] = useState(false)
  const src = imageError || !image ? PLACEHOLDER_IMAGE : image

  return (
    <div className={cn(styles.card, isFavorites && styles.cardFavorites)} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <img
          src={src}
          alt={title}
          className={styles.image}
          onError={() => setImageError(true)}
        />
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
            tipoAnuncio={tipoAnuncio}
            sourceUrl={sourceUrl}
            viewClassName={cn(styles.viewBtn, isFavorites && styles.viewBtnFavorites)}
            badgeClassName={cn(styles.statusBtn, isFavorites && styles.statusBtnFavorites)}
          />
        </div>
      </div>
    </div>
  )
}
