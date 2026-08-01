import { useMemo, useState } from 'react'
import { Slider } from 'radix-ui'
import SearchArea, { type FilterChip } from '@/components/home/SearchArea'
import MapView, { type MapMarker } from '@/components/home/MapView'
import PropertyStrip from '@/components/home/PropertyStrip'
import PropertyDetail from '@/components/home/PropertyDetail'
import FilterPanel, { DEFAULT_FILTERS, PRICE_MAX, type Filters } from '@/components/home/FilterPanel'
import { type PropertyCardProps } from '@/components/home/PropertyCard'
import { useImoveis } from '@/hooks/useImoveis'
import { slugify } from '@/lib/neighborhoodCoords'
import { spreadOverlappingMarkers } from '@/lib/markerLayout'
import {
  getCampus,
  haversineKm,
  formatRadius,
  RADIUS_MIN_KM,
  RADIUS_MAX_KM,
  RADIUS_STEP_KM,
} from '@/lib/campuses'
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
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null)
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
    if (filters.fonte) {
      next.fonte = filters.fonte
    }

    return next
  }, [activeChipData, filters])

  const { properties: allProperties, loading, error, refetch } = useImoveis(apiFilters)

  const activeCampus = getCampus(filters.campusId)

  // Filtro de distância: aplicado no cliente, porque os imóveis não têm coordenada
  // própria — a posição usada é o centro do bairro (ver lib/neighborhoodCoords).
  const properties = useMemo(() => {
    if (!activeCampus) return allProperties
    return allProperties.filter(
      (p) =>
        p.lat !== undefined &&
        p.lng !== undefined &&
        haversineKm(activeCampus, { lat: p.lat, lng: p.lng }) <= filters.radiusKm,
    )
  }, [allProperties, activeCampus, filters.radiusKm])

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

  const markers: MapMarker[] = useMemo(() => {
    const withCoords = properties
      .map((p, index) => ({ id: p.id, lat: p.lat, lng: p.lng, price: p.price, index }))
      .filter((p): p is { id: string; lat: number; lng: number; price: string; index: number } =>
        p.lat !== undefined && p.lng !== undefined
      )

    return spreadOverlappingMarkers(withCoords)
  }, [properties])

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

  /** Clique no pino do campus: liga o raio, ou desliga se já estava selecionado. */
  function handleCampusClick(id: string) {
    setFilters((prev) => ({ ...prev, campusId: prev.campusId === id ? '' : id }))
    setSelectedProperty(null)
    setActiveCardIndex(null)
  }

  function handleSuggestionSelect(neighborhood: string) {
    selectSearchedNeighborhood(neighborhood)
  }

  return (
    <div className={styles.mapWrapper}>
      <MapView
        markers={markers}
        activeIndex={activeCardIndex}
        onMarkerClick={handleSelect}
        campusId={filters.campusId}
        radiusKm={filters.radiusKm}
        onCampusClick={handleCampusClick}
      />
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

        {activeCampus && (
          <div className={styles.campusBanner}>
            <div className={styles.campusText}>
              <span>
                <strong>{properties.length}</strong>{' '}
                {properties.length === 1 ? 'imóvel' : 'imóveis'} até{' '}
                <strong>{formatRadius(filters.radiusKm)}</strong> da {activeCampus.sigla}
              </span>
              <span className={styles.campusSub}>{activeCampus.nome}</span>
            </div>

            <div className={styles.campusSlider}>
              <span className={styles.campusRadiusLabel}>{formatRadius(RADIUS_MIN_KM)}</span>
              <Slider.Root
                className={styles.slider}
                min={RADIUS_MIN_KM}
                max={RADIUS_MAX_KM}
                step={RADIUS_STEP_KM}
                value={[filters.radiusKm]}
                onValueChange={([km]) => setFilters((prev) => ({ ...prev, radiusKm: km }))}
              >
                <Slider.Track className={styles.sliderTrack}>
                  <Slider.Range className={styles.sliderRange} />
                </Slider.Track>
                <Slider.Thumb className={styles.sliderThumb} aria-label="Raio de distância" />
              </Slider.Root>
              <span className={styles.campusRadiusLabel}>{formatRadius(RADIUS_MAX_KM)}</span>
            </div>

            <button
              className={styles.campusClear}
              onClick={() => setFilters((prev) => ({ ...prev, campusId: '' }))}
            >
              Limpar
            </button>
          </div>
        )}
      </div>

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
          <PropertyStrip properties={properties} onCardClick={handleSelect} onHover={setActiveCardIndex} />
        )}
      </div>

      {selectedProperty && (
        <PropertyDetail
          property={selectedProperty}
          onClose={() => { setSelectedProperty(null); setActiveCardIndex(null) }}
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
