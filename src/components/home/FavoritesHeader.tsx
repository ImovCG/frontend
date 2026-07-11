import { Info } from 'lucide-react'
import styles from '@/styles/home/FavoritesHeader.module.css'

interface FavoritesHeaderProps {
  count: number
}

export function FavoritesHeader({ count }: FavoritesHeaderProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Meus Favoritos</h1>
        <span className={styles.badge}>
          {count} {count === 1 ? 'imóvel' : 'imóveis'}
        </span>
      </div>

      <div className={styles.banner}>
        <Info size={16} className={styles.bannerIcon} />
        <p>
          Preços e disponibilidade são atualizados semanalmente. Imóveis removidos da origem são sinalizados
          automaticamente.
        </p>
      </div>
    </div>
  )
}
