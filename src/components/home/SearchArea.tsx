import { useEffect, useRef } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
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
  searchOpen?: boolean
  searchValue?: string
  onSearchClick?: () => void
  onSearchChange?: (value: string) => void
  onSearchClose?: () => void
  onFilterClick?: () => void
  onChipClick?: (id: string) => void
}

export default function SearchArea({
  chips,
  count,
  searchOpen = false,
  searchValue = '',
  onSearchClick,
  onSearchChange,
  onSearchClose,
  onFilterClick,
  onChipClick,
}: SearchAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  return (
    <div className={styles.bar}>
      {searchOpen ? (
        <div className={styles.searchRow}>
          <Search className={styles.searchInputIcon} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar por título, bairro..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.iconBtn} onClick={onSearchClose}>
            <X className={styles.icon} />
          </button>
        </div>
      ) : (
        <>
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
        </>
      )}

      {count !== undefined && !searchOpen && (
        <span className={styles.count}>
          <strong>{count}</strong>
          <span>imóveis</span>
        </span>
      )}
    </div>
  )
}
