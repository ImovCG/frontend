import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import styles from '@/styles/home/MapView.module.css'

const CENTER: [number, number] = [-7.2306, -35.8811]

export default function MapView() {
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
      </MapContainer>
    </div>
  )
}
