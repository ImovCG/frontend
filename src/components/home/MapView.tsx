import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import styles from '@/styles/home/MapView.module.css'

export interface MapMarker {
  lat: number
  lng: number
  price: string
  index: number
}

interface MapViewProps {
  markers?: MapMarker[]
  activeIndex?: number | null
  onMarkerClick?: (index: number) => void
}

const CENTER: [number, number] = [-7.2306, -35.8811]

function formatPrice(raw: string): string {
  return raw.replace(/,00$/, '')
}

function createPriceIcon(price: string, isActive: boolean) {
  const label = formatPrice(price)
  const background = isActive ? '#EA580C' : '#141414'
  const scale = isActive ? 1.15 : 1
  return L.divIcon({
    html: `<div style="
      background:${background};
      color:#fff;
      font-size:14px;
      font-weight:600;
      padding:8px 18px;
      border-radius:50px;
      white-space:nowrap;
      box-shadow:0 2px 10px rgba(0,0,0,0.45);
      cursor:pointer;
      user-select:none;
      transform:scale(${scale});
      transition:transform 0.15s ease, background 0.15s ease;
      z-index:${isActive ? 1000 : 0};
    ">${label}</div>`,
    className: '',
    iconSize: undefined,
    iconAnchor: [45, 20],
  })
}

function FlyToActive({ position }: { position: [number, number] | null }) {
  const map = useMap()

  useEffect(() => {
    if (!position) return
    map.flyTo(position, Math.max(map.getZoom(), 15), { duration: 0.6 })
  }, [position, map])

  return null
}

export default function MapView({ markers = [], activeIndex = null, onMarkerClick }: MapViewProps) {
  const activeMarker = activeIndex != null ? markers.find((m) => m.index === activeIndex) : undefined
  const activePosition: [number, number] | null = activeMarker ? [activeMarker.lat, activeMarker.lng] : null

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
            icon={createPriceIcon(m.price, m.index === activeIndex)}
            eventHandlers={{ click: () => onMarkerClick?.(m.index) }}
          />
        ))}
        <FlyToActive position={activePosition} />
      </MapContainer>
    </div>
  )
}
