// Campi usados como ponto de referência do filtro "perto da universidade".
// Coordenadas obtidas do Nominatim/OpenStreetMap a partir do endereço oficial de cada campus.
export interface Campus {
  id: string
  sigla: string
  nome: string
  endereco: string
  lat: number
  lng: number
}

export const CAMPUSES: Campus[] = [
  {
    id: 'ufcg',
    sigla: 'UFCG',
    nome: 'UFCG — Campus Campina Grande',
    endereco: 'Av. Aprígio Veloso, 882 — Universitário',
    lat: -7.2142430,
    lng: -35.9077467,
  },
  {
    id: 'uepb',
    sigla: 'UEPB',
    nome: 'UEPB — Campus I',
    endereco: 'Rua Baraúnas, 351 — Universitário',
    lat: -7.2099317,
    lng: -35.9152810,
  },
  {
    id: 'ifpb',
    sigla: 'IFPB',
    nome: 'IFPB — Campus Campina Grande',
    endereco: 'R. Tranquilino Coelho de Lemos, 671 — Dinamérica',
    lat: -7.2401400,
    lng: -35.9154358,
  },
]

export const RADIUS_MIN_KM = 0.5
export const RADIUS_MAX_KM = 6
export const RADIUS_STEP_KM = 0.5
export const DEFAULT_RADIUS_KM = 2

export function getCampus(id: string): Campus | undefined {
  return CAMPUSES.find((c) => c.id === id)
}

const EARTH_RADIUS_KM = 6371

interface Point {
  lat: number
  lng: number
}

/** Distância em linha reta entre dois pontos, em quilômetros. */
export function haversineKm(a: Point, b: Point): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

export function formatRadius(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toLocaleString('pt-BR')} km`
}
