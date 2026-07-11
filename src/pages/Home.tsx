import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import SearchArea, { type FilterChip } from '@/components/home/SearchArea'
import MapView, { type MapMarker } from '@/components/home/MapView'
import PropertyStrip from '@/components/home/PropertyStrip'
import PropertyDetail from '@/components/home/PropertyDetail'
import FilterPanel, { DEFAULT_FILTERS, type Filters } from '@/components/home/FilterPanel'
import { type PropertyCardProps } from '@/components/home/PropertyCard'
import { parsePriceToNumber } from '@/lib/property'
import { PROPERTIES } from '@/data/properties'
import { CAMPINA_GRANDE_NEIGHBORHOODS } from '@/data/neighborhoods'
import styles from '@/styles/pages/Home.module.css'

const ALL_CHIP_ID = 'all'

const INITIAL_NEIGHBORHOOD_CHIPS: FilterChip[] = [
  { id: 'universitario', label: 'Universitário' },
  { id: 'bodocongo', label: 'Bodocongó' },
  { id: 'tres-irmaos', label: 'Três Irmãos' },
  { id: 'centenario', label: 'Centenário' },
]

const ACCENT_MAP: Record<string, string> = {
  á: 'a', à: 'a', â: 'a', ã: 'a', ä: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  í: 'i', ì: 'i', î: 'i', ï: 'i',
  ó: 'o', ò: 'o', ô: 'o', õ: 'o', ö: 'o',
  ú: 'u', ù: 'u', û: 'u', ü: 'u',
  ç: 'c', ñ: 'n',
}

function slugify(text: string): string {
  const plain = text
    .toLowerCase()
    .split('')
    .map((ch) => ACCENT_MAP[ch] ?? ch)
    .join('')
  return plain.trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function matchesType(title: string, type: string): boolean {
  if (!type) return true
  return title.toLowerCase().includes(type.toLowerCase())
}

export default function Home() {
  const [chips, setChips] = useState<FilterChip[]>(INITIAL_NEIGHBORHOOD_CHIPS)
  const [activeChip, setActiveChip] = useState(ALL_CHIP_ID)
  const [selectedProperty, setSelectedProperty] = useState<PropertyCardProps | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const displayChips: FilterChip[] = [
    { id: ALL_CHIP_ID, label: 'Todos' },
    ...chips,
  ].map((c) => ({ ...c, active: c.id === activeChip }))
  const activeChipData = chips.find((c) => c.id === activeChip)

  const suggestions =
    searchQuery.length >= 2
      ? CAMPINA_GRANDE_NEIGHBORHOODS.filter((n) =>
          n.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6)
      : []

  const filtered = PROPERTIES.filter((p) => {
    if (activeChipData) {
      const q = activeChipData.label.toLowerCase()
      const matchesNeighborhood =
        p.neighborhoodId === activeChipData.id ||
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      if (!matchesNeighborhood) return false
    }
    if (filters.minBeds && p.beds < filters.minBeds) return false
    if (filters.minBaths && p.baths < filters.minBaths) return false
    if (filters.maxPrice) {
      const price = parsePriceToNumber(p.price)
      if (price !== null && price > filters.maxPrice) return false
    }
    if (!matchesType(p.title, filters.type)) return false
    return true
  })

  const markers: MapMarker[] = filtered
    .filter((p) => p.lat !== undefined && p.lng !== undefined)
    .map((p, i) => ({ lat: p.lat!, lng: p.lng!, price: p.price, index: i }))

  function handleSelect(index: number) {
    setSelectedProperty(filtered[index] ?? null)
  }

  function handleChipClick(id: string) {
    setActiveChip(id)
    setSearchQuery('')
    setIsSearchOpen(false)
  }

  // Neighborhood not in the visible slots takes over whichever slot is currently active,
  // so it sticks around like a rotating queue as the user moves between chips.
  function selectSearchedNeighborhood(name: string) {
    const id = slugify(name)
    const existing = chips.find((c) => c.id === id || slugify(c.label) === id)

    if (existing) {
      setActiveChip(existing.id)
    } else {
      setChips((prev) => prev.map((c) => (c.id === activeChip ? { id, label: name } : c)))
      setActiveChip(id)
    }

    setSearchQuery('')
    setIsSearchOpen(false)
  }

  function handleSearchSubmit(query: string) {
    selectSearchedNeighborhood(query)
  }

  function handleSuggestionSelect(neighborhood: string) {
    selectSearchedNeighborhood(neighborhood)
  }

  return (
    <div className={styles.mapWrapper}>
      <MapView markers={markers} onMarkerClick={handleSelect} />
      <div className={styles.filterOverlay}>
        <SearchArea
          chips={displayChips}
          count={filtered.length}
          searchOpen={isSearchOpen}
          searchValue={searchQuery}
          suggestions={suggestions}
          onSearchClick={() => setIsSearchOpen(true)}
          onSearchChange={setSearchQuery}
          onSearchClose={() => { setIsSearchOpen(false); setSearchQuery('') }}
          onSearchSubmit={handleSearchSubmit}
          onSuggestionSelect={handleSuggestionSelect}
          onFilterClick={() => setIsFilterOpen(true)}
          onChipClick={handleChipClick}
        />
      </div>

      <button
        className={styles.filtersFab}
        onClick={() => setIsFilterOpen(true)}
        aria-label="Abrir filtros"
      >
        <SlidersHorizontal className={styles.filtersFabIcon} />
        Filtros
      </button>

      <div className={styles.cardStrip}>
        {filtered.length === 0 ? (
          <p className={styles.emptyMessage}>Nenhum imóvel encontrado com esses filtros.</p>
        ) : (
          <PropertyStrip properties={filtered} onCardClick={handleSelect} />
        )}
      </div>

      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {isFilterOpen && (
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onClose={() => setIsFilterOpen(false)}
          onClear={() => setFilters(DEFAULT_FILTERS)}
        />
      )}
    </div>
  )
}
