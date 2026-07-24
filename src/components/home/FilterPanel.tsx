import { X } from 'lucide-react'
import { Slider } from 'radix-ui'
import { CAMPINA_GRANDE_NEIGHBORHOODS } from '@/data/neighborhoods'
import styles from '@/styles/home/FilterPanel.module.css'

export const PRICE_MAX = 5000
export const PRICE_STEP = 50

export interface Filters {
  minPrice: number
  maxPrice: number
  minBeds: number
  minBaths: number
  minArea: number
  categoria: string
  bairro: string
}

export const DEFAULT_FILTERS: Filters = {
  minPrice: 0,
  maxPrice: PRICE_MAX,
  minBeds: 0,
  minBaths: 0,
  minArea: 0,
  categoria: '',
  bairro: '',
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

const BATH_OPTIONS = [
  { label: 'Qualquer', value: 0 },
  { label: '1+', value: 1 },
  { label: '2+', value: 2 },
  { label: '3+', value: 3 },
]

const AREA_OPTIONS = [
  { label: 'Qualquer', value: 0 },
  { label: '40m²+', value: 40 },
  { label: '60m²+', value: 60 },
  { label: '80m²+', value: 80 },
]

const CATEGORY_OPTIONS = [
  { label: 'Todas', value: '' },
  { label: 'Casa', value: 'casa' },
  { label: 'Apartamento', value: 'apartamento' },
  { label: 'Kitnet', value: 'kitnet' },
]

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

export default function FilterPanel({ filters, onChange, onClose, onClear }: FilterPanelProps) {
  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value })
  }

  const maxLabel =
    filters.maxPrice >= PRICE_MAX ? `${formatBRL(PRICE_MAX)}+` : formatBRL(filters.maxPrice)
  const priceLabel = `${formatBRL(filters.minPrice)} — ${maxLabel}`

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
            <div className={styles.labelRow}>
              <p className={styles.label}>Preço</p>
              <span className={styles.priceValue}>{priceLabel}</span>
            </div>
            <Slider.Root
              className={styles.slider}
              min={0}
              max={PRICE_MAX}
              step={PRICE_STEP}
              minStepsBetweenThumbs={1}
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={([min, max]) => onChange({ ...filters, minPrice: min, maxPrice: max })}
            >
              <Slider.Track className={styles.sliderTrack}>
                <Slider.Range className={styles.sliderRange} />
              </Slider.Track>
              <Slider.Thumb className={styles.sliderThumb} aria-label="Preço mínimo" />
              <Slider.Thumb className={styles.sliderThumb} aria-label="Preço máximo" />
            </Slider.Root>
          </section>

          <section className={styles.section}>
            <p className={styles.label}>Tipo de imóvel</p>
            <div className={styles.optionRow}>
              {CATEGORY_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => set('categoria', o.value)}
                  className={filters.categoria === o.value ? styles.optionActive : styles.option}
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

          <section className={styles.section}>
            <p className={styles.label}>Banheiros</p>
            <div className={styles.optionRow}>
              {BATH_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => set('minBaths', o.value)}
                  className={filters.minBaths === o.value ? styles.optionActive : styles.option}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.label}>Área mínima</p>
            <div className={styles.optionRow}>
              {AREA_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  onClick={() => set('minArea', o.value)}
                  className={filters.minArea === o.value ? styles.optionActive : styles.option}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <p className={styles.label}>Bairro</p>
            <select
              className={styles.select}
              value={filters.bairro}
              onChange={(e) => set('bairro', e.target.value)}
            >
              <option value="">Todos os bairros</option>
              {CAMPINA_GRANDE_NEIGHBORHOODS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
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
