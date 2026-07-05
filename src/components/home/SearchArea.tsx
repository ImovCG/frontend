import { useEffect, useRef } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import styles from '@/styles/home/SearchArea.module.css'

export interface FilterChip {
  id: string
  label: string
  count?: number
  active?: boolean
  removable?: boolean
}

interface SearchAreaProps {
  chips: FilterChip[]
  count?: number
  searchOpen?: boolean
  searchValue?: string
  suggestions?: string[]
  onSearchClick?: () => void
  onSearchChange?: (value: string) => void
  onSearchClose?: () => void
  onSearchSubmit?: (query: string) => void
  onSuggestionSelect?: (value: string) => void
  onFilterClick?: () => void
  onChipClick?: (id: string) => void
  onChipRemove?: (id: string) => void
}

export default function SearchArea({
  chips,
  count,
  searchOpen = false,
  searchValue = '',
  suggestions = [],
  onSearchClick,
  onSearchChange,
  onSearchClose,
  onSearchSubmit,
  onSuggestionSelect,
  onFilterClick,
  onChipClick,
  onChipRemove,
}: SearchAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && searchValue.trim()) {
      onSearchSubmit?.(searchValue.trim())
    }
    if (e.key === 'Escape') {
      onSearchClose?.()
    }
  }

  const showSuggestions = searchOpen && suggestions.length > 0

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        {searchOpen ? (
          <div className={styles.searchRow}>
            <Search className={styles.searchInputIcon} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar bairro ou imóvel... (Enter para confirmar)"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              onKeyDown={handleKeyDown}
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
                {chip.removable && (
                  <span
                    role="button"
                    className={styles.chipRemove}
                    onClick={(e) => { e.stopPropagation(); onChipRemove?.(chip.id) }}
                  >
                    <X className={styles.chipRemoveIcon} />
                  </span>
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

      {showSuggestions && (
        <ul className={styles.dropdown}>
          {suggestions.map((s) => (
            <li key={s}>
              <button
                className={styles.suggestion}
                onMouseDown={(e) => { e.preventDefault(); onSuggestionSelect?.(s) }}
              >
                <Search className={styles.suggestionIcon} />
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
