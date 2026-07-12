import { X } from 'lucide-react'
import styles from '@/styles/home/FilterPanel.module.css'

export interface Filters {
  minBeds: number
  maxPrice: number
}

interface FilterPanelProps {
  filters: Filters
  onChange: (filters: Filters) => void
  onClose: () => void
  onClear: () => void
}

const BED_OPTIONS = [
  { label: 'Qualquer', value: 0 },
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
  { label: '4+', value: 4 },
]

const PRICE_OPTIONS = [
  { label: 'Qualquer', value: 0 },
  { label: 'Até R$ 300k', value: 300_000 },
  { label: 'Até R$ 600k', value: 600_000 },
  { label: 'Até R$ 1M', value: 1_000_000 },
  { label: 'Até R$ 2M', value: 2_000_000 },
]

export const DEFAULT_FILTERS: Filters = { minBeds: 0, maxPrice: 0 }

export default function FilterPanel({ filters, onChange, onClose, onClear }: FilterPanelProps) {
  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Filtros</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.body}>
          <section className={styles.section}>
            <p className={styles.label}>Preço máximo</p>
            <div className={styles.optionRow}>
              {PRICE_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => set('maxPrice', o.value)}
                  className={filters.maxPrice === o.value ? styles.optionActive : styles.option}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.label}>Quartos</p>
            <div className={styles.optionRow}>
              {BED_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => set('minBeds', o.value)}
                  className={filters.minBeds === o.value ? styles.optionActive : styles.option}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.footer}>
          <button className={styles.clearBtn} onClick={onClear}>Limpar filtros</button>
          <button className={styles.applyBtn} onClick={onClose}>Ver imóveis</button>
        </div>
      </div>
    </div>
  )
}
