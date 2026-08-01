import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import styles from '@/styles/home/MapView.module.css'
import { CAMPUSES, getCampus, type Campus } from '@/lib/campuses'

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
  /** Campus selecionado no filtro "perto da universidade" ('' = nenhum). */
  campusId?: string
  radiusKm?: number
  onCampusClick?: (id: string) => void
}

const CENTER: [number, number] = [-7.2306, -35.8811]
const CAMPUS_COLOR = '#2563EB'

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

/** Pino do campus: sempre azul sólido com texto branco; anel branco quando é o filtrado. */
function createCampusIcon(campus: Campus, isActive: boolean) {
  const ring = isActive
    ? `box-shadow:0 0 0 3px #FFFFFF, 0 0 0 6px ${CAMPUS_COLOR}, 0 4px 14px rgba(0,0,0,0.45);`
    : `box-shadow:0 2px 10px rgba(0,0,0,0.45);`
  return L.divIcon({
    html: `<div style="
      display:flex;
      align-items:center;
      gap:6px;
      background:${CAMPUS_COLOR};
      color:#FFFFFF;
      border:2px solid rgba(255,255,255,0.9);
      font-size:13px;
      font-weight:700;
      letter-spacing:0.02em;
      padding:6px 12px;
      border-radius:50px;
      white-space:nowrap;
      ${ring}
      cursor:pointer;
      user-select:none;
      transform:scale(${isActive ? 1.12 : 1});
      transition:transform 0.15s ease, box-shadow 0.15s ease;
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF"
           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>
      </svg>
      ${campus.sigla}
    </div>`,
    className: '',
    iconSize: undefined,
    iconAnchor: [40, 16],
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

/** Ao escolher um campus, enquadra o mapa no círculo do raio. */
function FitToRadius({ campusId, radiusKm }: { campusId: string; radiusKm: number }) {
  const map = useMap()

  useEffect(() => {
    const campus = getCampus(campusId)
    if (!campus) return
    const bounds = L.latLng(campus.lat, campus.lng).toBounds(radiusKm * 2000)
    // fitBounds sem animação: o flyToBounds animado deixa as camadas vetoriais
    // (o círculo) com a projeção defasada em relação aos marcadores.
    map.fitBounds(bounds, { padding: [40, 40], animate: false })
  }, [campusId, radiusKm, map])

  return null
}

export default function MapView({
  markers = [],
  activeIndex = null,
  onMarkerClick,
  campusId = '',
  radiusKm = 0,
  onCampusClick,
}: MapViewProps) {
  const activeMarker = activeIndex != null ? markers.find((m) => m.index === activeIndex) : undefined
  const activePosition: [number, number] | null = activeMarker ? [activeMarker.lat, activeMarker.lng] : null
  const selectedCampus = getCampus(campusId)

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
        {selectedCampus && radiusKm > 0 && (
          <Circle
            center={[selectedCampus.lat, selectedCampus.lng]}
            radius={radiusKm * 1000}
            pathOptions={{
              color: CAMPUS_COLOR,
              weight: 2,
              dashArray: '6 6',
              fillColor: CAMPUS_COLOR,
              fillOpacity: 0.08,
            }}
          />
        )}

        {markers.map((m, i) => (
          <Marker
            key={i}
            position={[m.lat, m.lng]}
            icon={createPriceIcon(m.price, m.index === activeIndex)}
            eventHandlers={{ click: () => onMarkerClick?.(m.index) }}
          />
        ))}

        {CAMPUSES.map((campus) => (
          <Marker
            key={campus.id}
            position={[campus.lat, campus.lng]}
            icon={createCampusIcon(campus, campus.id === campusId)}
            zIndexOffset={1000}
            eventHandlers={{ click: () => onCampusClick?.(campus.id) }}
          />
        ))}

        <FlyToActive position={activePosition} />
        {selectedCampus && <FitToRadius campusId={campusId} radiusKm={radiusKm} />}
      </MapContainer>
    </div>
  )
}
