import Header from '@/components/layout/Header'
import SearchArea, { type FilterChip } from '@/components/home/SearchArea'
import MapView from '@/components/home/MapView'
import PropertyStrip from '@/components/home/PropertyStrip'
import { type PropertyCardProps } from '@/components/home/PropertyCard'
import styles from '@/styles/pages/Home.module.css'

const SEARCH_CHIPS: FilterChip[] = [
  { id: 'universitario', label: 'Universitário', active: true },
  { id: 'bodocongo', label: 'Bodocongó' },
  { id: 'tres-irmaos', label: 'Três Irmãos' },
  { id: 'centenario', label: 'Centenário' },
]

const PROPERTIES: PropertyCardProps[] = [
  {
    image: 'https://placehold.co/400x250/e2e8f0/64748b?text=Im%C3%B3vel+1',
    title: 'Casa com piscina no Jardim dos Estados',
    price: 'R$ 750.000',
    location: 'Jardim dos Estados, Campina Grande - PB',
    beds: 3,
    baths: 2,
    area: 180,
    isFavorite: true,
  },
  {
    image: 'https://placehold.co/400x250/e2e8f0/64748b?text=Im%C3%B3vel+2',
    title: 'Apartamento moderno no Chácara Cachoeira',
    price: 'R$ 420.000',
    location: 'Chácara Cachoeira, Campina Grande - PB',
    beds: 2,
    baths: 1,
    area: 72,
    isFavorite: false,
  },
  {
    image: 'https://placehold.co/400x250/e2e8f0/64748b?text=Im%C3%B3vel+3',
    title: 'Sobrado amplo no Bairro Autonomista',
    price: 'R$ 590.000',
    location: 'Autonomista, Campina Grande - PB',
    beds: 4,
    baths: 3,
    area: 240,
    isFavorite: true,
  },
  {
    image: 'https://placehold.co/400x250/e2e8f0/64748b?text=Im%C3%B3vel+4',
    title: 'Kitnet mobiliada no Centro',
    price: 'R$ 185.000',
    location: 'Centro, Campina Grande - PB',
    beds: 1,
    baths: 1,
    area: 32,
    isFavorite: false,
  },
  {
    image: 'https://placehold.co/400x250/e2e8f0/64748b?text=Im%C3%B3vel+5',
    title: 'Cobertura duplex na Prata',
    price: 'R$ 1.200.000',
    location: 'Prata, Campina Grande - PB',
    beds: 4,
    baths: 4,
    area: 320,
    isFavorite: false,
  },
]

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.mapWrapper}>
        <MapView />
        <div className={styles.filterOverlay}>
          <SearchArea chips={SEARCH_CHIPS} count={PROPERTIES.length} />
        </div>
        <div className={styles.cardStrip}>
          <PropertyStrip properties={PROPERTIES} />
        </div>
      </div>
    </div>
  )
}
