import { useState } from 'react'
import SearchArea, { type FilterChip } from '@/components/home/SearchArea'
import MapView, { type MapMarker } from '@/components/home/MapView'
import PropertyStrip from '@/components/home/PropertyStrip'
import PropertyDetail from '@/components/home/PropertyDetail'
import FilterPanel, { DEFAULT_FILTERS, type Filters } from '@/components/home/FilterPanel'
import { type PropertyCardProps } from '@/components/home/PropertyCard'
import { PROPERTIES } from '@/data/properties'
import { CAMPINA_GRANDE_NEIGHBORHOODS } from '@/data/neighborhoods'
import styles from '@/styles/pages/Home.module.css'

const NEIGHBORHOOD_CHIPS: FilterChip[] = [
  { id: 'universitario', label: 'Universitário' },
  { id: 'bodocongo', label: 'Bodocongó' },
  { id: 'tres-irmaos', label: 'Três Irmãos' },
  { id: 'centenario', label: 'Centenário' },
]

function matchesType(title: string, type: string): boolean {
  if (!type) return true
  return title.toLowerCase().includes(type.toLowerCase())
}

export default function Home() {
  const [activeChip, setActiveChip] = useState('universitario')
  const [selectedProperty, setSelectedProperty] = useState<PropertyCardProps | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchChip, setSearchChip] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  // Search chip replaces the currently active neighborhood chip
  const chips: FilterChip[] = NEIGHBORHOOD_CHIPS.map((c) => {
    if (searchChip && c.id === activeChip) {
      return { id: '__search__', label: searchChip, active: true, removable: true }
    }
    return { ...c, active: !searchChip && c.id === activeChip }
  })

  const suggestions =
    searchQuery.length >= 2
      ? CAMPINA_GRANDE_NEIGHBORHOODS.filter((n) =>
          n.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6)
      : []

  const filtered = PROPERTIES.filter((p) => {
    if (searchChip) {
      const q = searchChip.toLowerCase()
      if (!p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false
    } else {
      if (p.neighborhoodId !== activeChip) return false
    }
    if (filters.minBeds && p.beds < filters.minBeds) return false
    if (filters.minBaths && p.baths < filters.minBaths) return false
    if (filters.maxPrice) {
      const price = parseInt(p.price.replace(/\D/g, ''), 10)
      if (price > filters.maxPrice) return false
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
    if (id === '__search__') return
    setActiveChip(id)
    setSearchChip(null)
    setSearchQuery('')
    setIsSearchOpen(false)
  }

  function handleSearchSubmit(query: string) {
    setSearchChip(query)
    setSearchQuery('')
    setIsSearchOpen(false)
  }

  function handleSuggestionSelect(neighborhood: string) {
    setSearchChip(neighborhood)
    setSearchQuery('')
    setIsSearchOpen(false)
  }

  function handleRemoveSearchChip() {
    setSearchChip(null)
  }

  return (
    <div className={styles.mapWrapper}>
      <MapView markers={markers} onMarkerClick={handleSelect} />
      <div className={styles.filterOverlay}>
        <SearchArea
          chips={chips}
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
          onChipRemove={handleRemoveSearchChip}
        />
      </div>
      <div className={styles.cardStrip}>
        <PropertyStrip properties={filtered} onCardClick={handleSelect} />
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
