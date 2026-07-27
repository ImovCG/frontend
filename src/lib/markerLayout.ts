const GOLDEN_ANGLE = 137.508 * (Math.PI / 180)
const RING_SPACING_METERS = 22
const METERS_PER_DEGREE_LAT = 111_320

interface Positioned {
  id: string
  lat: number
  lng: number
}

function roundKey(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`
}

export function spreadOverlappingMarkers<T extends Positioned>(items: T[]): T[] {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const key = roundKey(item.lat, item.lng)
    const group = groups.get(key)
    if (group) group.push(item)
    else groups.set(key, [item])
  }

  const result: T[] = []
  for (const group of groups.values()) {
    if (group.length === 1) {
      result.push(group[0])
      continue
    }

    const sorted = [...group].sort((a, b) => a.id.localeCompare(b.id))
    const latRad = (sorted[0].lat * Math.PI) / 180
    const metersPerDegreeLng = METERS_PER_DEGREE_LAT * Math.cos(latRad)

    sorted.forEach((item, i) => {
      if (i === 0) {
        result.push(item)
        return
      }
      const radius = RING_SPACING_METERS * Math.sqrt(i)
      const angle = i * GOLDEN_ANGLE
      const dLat = (radius * Math.cos(angle)) / METERS_PER_DEGREE_LAT
      const dLng = (radius * Math.sin(angle)) / metersPerDegreeLng
      result.push({ ...item, lat: item.lat + dLat, lng: item.lng + dLng })
    })
  }

  return result
}
