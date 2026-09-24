import { Bath, Bed, Heart, MapPin, Maximize2, MessageCircle, X } from 'lucide-react'
import { type PropertyCardProps } from '@/components/home/PropertyCard'
import { useFavorites } from '@/context/FavoritesContext'
import { ehAnuncioProprio, formatarTelefone, linkWhatsApp } from '@/lib/contato'
import { FALLBACK_SOURCE_URL } from '@/lib/property'
import { cn } from '@/lib/utils'
import styles from '@/styles/home/PropertyDetail.module.css'

interface PropertyDetailProps {
  property: PropertyCardProps
  onClose: () => void
}

export default function PropertyDetail({ property, onClose }: PropertyDetailProps) {
  const { isFav, toggle } = useFavorites()
  const favorite = isFav(property.id)

  const proprio = ehAnuncioProprio(property.fonte)
  const whatsapp = proprio ? linkWhatsApp(property.anuncianteTelefone, property.title) : null
  const telefone = formatarTelefone(property.anuncianteTelefone)

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageWrapper}>
          <img src={property.image} alt={property.title} className={styles.image} referrerPolicy="no-referrer" />
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar">
            <X className={styles.closeIcon} />
          </button>
          <span className={styles.priceBadge}>{property.price}</span>
        </div>

        <div className={styles.body}>
          <div className={styles.headerRow}>
            <h2 className={styles.title}>{property.title}</h2>
            {property.tipoAnuncio && (
              <span className={styles.statusBadge}>{property.tipoAnuncio}</span>
            )}
          </div>

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

          <div className={styles.descriptionSection}>
            <h3 className={styles.sectionLabel}>Sobre o imóvel</h3>
            <p className={styles.description}>
              {property.description ?? (
                <>
                  Imóvel bem localizado em {property.location.split(',')[0]}, com excelente acabamento,
                  áreas de lazer completas e fácil acesso às principais vias da cidade.
                  Documentação regularizada e pronto para financiamento.
                </>
              )}
            </p>
          </div>

          {proprio && (
            <div className={styles.contatoBox}>
              <h3 className={styles.sectionLabel}>Anunciado no imovCG</h3>
              <p className={styles.contatoNome}>{property.anuncianteNome ?? 'Anunciante'}</p>
              <p className={styles.contatoTelefone}>
                {telefone ?? 'Contato ainda não informado pelo anunciante.'}
              </p>
            </div>
          )}

          <div className={styles.actions}>
            {proprio ? (
              <button
                className={styles.btnContact}
                disabled={!whatsapp}
                onClick={() => {
                  if (whatsapp) window.open(whatsapp, '_blank', 'noopener,noreferrer')
                }}
              >
                <MessageCircle className={styles.btnIcon} />
                {whatsapp ? 'Falar no WhatsApp' : 'Contato indisponível'}
              </button>
            ) : (
              <button
                className={styles.btnView}
                onClick={() => window.open(property.sourceUrl || FALLBACK_SOURCE_URL, '_blank', 'noopener,noreferrer')}
              >
                Ver anúncio
              </button>
            )}
            <button
              className={cn(styles.btnFavorite, favorite && styles.btnFavoriteActive)}
              onClick={() => toggle(property.id)}
              aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart className={cn(styles.btnIcon, favorite && styles.heartActive)} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
