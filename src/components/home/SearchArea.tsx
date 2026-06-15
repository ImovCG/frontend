import { Search, SlidersHorizontal } from 'lucide-react'
import styles from '@/styles/home/SearchArea.module.css'

export interface FilterChip {
  id: string
  label: string
  count?: number
  active?: boolean
}

interface SearchAreaProps {
  chips: FilterChip[]
  count?: number
  onSearchClick?: () => void
  onFilterClick?: () => void
  onChipClick?: (id: string) => void
}

export default function SearchArea({
  chips,
  count,
  onSearchClick,
  onFilterClick,
  onChipClick,
}: SearchAreaProps) {
  return (
    <div className={styles.bar}>
      {chips.map((chip) => (
        <button
          key={chip.id}
          onClick={() => onChipClick?.(chip.id)}
          className={chip.active ? styles.chipActive : styles.chip}
        >
          {chip.label}
          {chip.count !== undefined && (
            <span className={styles.chipCount}>{chip.count}</span>
          )}
        </button>
      ))}

      <div className={styles.divider} />

      <button className={styles.iconBtn} onClick={onSearchClick}>
        <Search className={styles.icon} />
      </button>

      <button className={styles.filtrosBtn} onClick={onFilterClick}>
        <SlidersHorizontal className={styles.icon} />
        Filtros
      </button>

      {count !== undefined && (
        <span className={styles.count}>
          <strong>{count}</strong>
          <span>imóveis</span>
        </span>
      )}
    </div>
  )
}
