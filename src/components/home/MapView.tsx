import L from 'leaflet'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import styles from '@/styles/home/MapView.module.css'
import { parsePriceToNumber } from '@/lib/property'

export interface MapMarker {
  lat: number
  lng: number
  price: string
  index: number
}

interface MapViewProps {
  markers?: MapMarker[]
  onMarkerClick?: (index: number) => void
}

const CENTER: [number, number] = [-7.2306, -35.8811]

function formatPrice(raw: string): string {
  const num = parsePriceToNumber(raw) ?? 0
  if (num >= 1_000_000) {
    const m = num / 1_000_000
    return `R$ ${m % 1 === 0 ? m : m.toFixed(1)}M`
  }
  if (num >= 1_000) {
    return `R$ ${Math.round(num / 1000)}k`
  }
  return `R$ ${num}`
}

function createPriceIcon(price: string) {
  const label = formatPrice(price)
  return L.divIcon({
    html: `<div style="
      background:#141414;
      color:#fff;
      font-size:14px;
      font-weight:600;
      padding:8px 18px;
      border-radius:50px;
      white-space:nowrap;
      box-shadow:0 2px 10px rgba(0,0,0,0.45);
      cursor:pointer;
      user-select:none;
    ">${label}</div>`,
    className: '',
    iconSize: undefined,
    iconAnchor: [45, 20],
  })
}

export default function MapView({ markers = [], onMarkerClick }: MapViewProps) {
  return (
    <div className={styles.wrapper}>
      <MapContainer
        center={CENTER}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((m, i) => (
          <Marker
            key={i}
            position={[m.lat, m.lng]}
            icon={createPriceIcon(m.price)}
            eventHandlers={{ click: () => onMarkerClick?.(m.index) }}
          />
        ))}
      </MapContainer>
    </div>
  )
}
