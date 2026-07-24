import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import SearchArea, { type FilterChip } from '@/components/home/SearchArea'
import MapView, { type MapMarker } from '@/components/home/MapView'
import PropertyStrip from '@/components/home/PropertyStrip'
import PropertyDetail from '@/components/home/PropertyDetail'
import FilterPanel, { DEFAULT_FILTERS, PRICE_MAX, type Filters } from '@/components/home/FilterPanel'
import { type PropertyCardProps } from '@/components/home/PropertyCard'
import { useImoveis } from '@/hooks/useImoveis'
import { slugify } from '@/lib/neighborhoodCoords'
import { CAMPINA_GRANDE_NEIGHBORHOODS } from '@/data/neighborhoods'
import type { ImoveisFiltros } from '@/types/imovel'
import styles from '@/styles/pages/Home.module.css'

const ALL_CHIP_ID = 'all'

const INITIAL_NEIGHBORHOOD_CHIPS: FilterChip[] = [
  { id: 'universitario', label: 'Universitário' },
  { id: 'bodocongo', label: 'Bodocongó' },
  { id: 'tres-irmaos', label: 'Três Irmãos' },
  { id: 'centenario', label: 'Centenário' },
]

export default function Home() {
  const [chips, setChips] = useState<FilterChip[]>(INITIAL_NEIGHBORHOOD_CHIPS)
  const [activeChip, setActiveChip] = useState(ALL_CHIP_ID)
  const [selectedProperty, setSelectedProperty] = useState<PropertyCardProps | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const activeChipData = chips.find((c) => c.id === activeChip)

  const apiFilters = useMemo<ImoveisFiltros>(() => {
    const next: ImoveisFiltros = { cidade: 'Campina Grande' }

    // Chip de bairro (barra superior) tem precedência sobre o do painel.
    if (activeChipData) {
      next.bairro = activeChipData.label
    } else if (filters.bairro) {
      next.bairro = filters.bairro
    }
    if (filters.minPrice > 0) {
      next.precoMin = filters.minPrice
    }
    if (filters.maxPrice < PRICE_MAX) {
      next.precoMax = filters.maxPrice
    }
    if (filters.minBeds > 0) {
      next.quartosMin = filters.minBeds
    }
    if (filters.minBaths > 0) {
      next.banheirosMin = filters.minBaths
    }
    if (filters.minArea > 0) {
      next.areaMin = filters.minArea
    }
    if (filters.categoria) {
      next.categoria = filters.categoria
    }

    return next
  }, [activeChipData, filters])

  const { properties, loading, error, refetch } = useImoveis(apiFilters)

  const displayChips: FilterChip[] = [
    { id: ALL_CHIP_ID, label: 'Todos' },
    ...chips,
  ].map((c) => ({ ...c, active: c.id === activeChip }))

  const suggestions =
    searchQuery.length >= 2
      ? CAMPINA_GRANDE_NEIGHBORHOODS.filter((n) =>
          n.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6)
      : []

  const markers: MapMarker[] = properties
    .filter((p) => p.lat !== undefined && p.lng !== undefined)
    .map((p, i) => ({ lat: p.lat!, lng: p.lng!, price: p.price, index: i }))

  function handleSelect(index: number) {
    setSelectedProperty(properties[index] ?? null)
  }

  function handleChipClick(id: string) {
    setActiveChip(id)
    setSearchQuery('')
    setIsSearchOpen(false)
  }

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
          count={loading ? 0 : properties.length}
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
        {loading ? (
          <p className={styles.emptyMessage}>Carregando imóveis...</p>
        ) : error ? (
          <div className={styles.emptyMessage}>
            <p>{error}</p>
            <button type="button" onClick={refetch} className={styles.retryBtn}>
              Tentar novamente
            </button>
          </div>
        ) : properties.length === 0 ? (
          <p className={styles.emptyMessage}>Nenhum imóvel encontrado com esses filtros.</p>
        ) : (
          <PropertyStrip properties={properties} onCardClick={handleSelect} />
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
