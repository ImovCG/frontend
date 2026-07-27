// Prep utility for when address→coordinate lookup is needed (e.g. an admin form for manually
// registered anúncios). Not wired into any flow yet.
//
// Nominatim's usage policy (https://operations.osmfoundation.org/policies/nominatim/) expects
// server-side calls with a proper identifying User-Agent and max ~1 req/s — browsers can't set a
// custom User-Agent, so calling this directly from the client works for light/manual testing but
// should move behind a small backend proxy before any bulk/automated use.

const NOMINATIM_SEARCH_URL = 'https://nominatim.openstreetmap.org/search'

export interface GeocodeResult {
  lat: number
  lng: number
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({
    q: `${address}, Campina Grande, PB, Brasil`,
    format: 'json',
    limit: '1',
  })

  const response = await fetch(`${NOMINATIM_SEARCH_URL}?${params}`, {
    headers: { 'Accept-Language': 'pt-BR' },
  })
  if (!response.ok) return null

  const results = (await response.json()) as Array<{ lat: string; lon: string }>
  const first = results[0]
  if (!first) return null

  return { lat: parseFloat(first.lat), lng: parseFloat(first.lon) }
}

const BAIRRO_CACHE_KEY = 'imovcg:bairro-geocode-cache:v1'

function readBairroCache(): Record<string, GeocodeResult | null> {
  try {
    const raw = localStorage.getItem(BAIRRO_CACHE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, GeocodeResult | null>) : {}
  } catch {
    return {}
  }
}

function writeBairroCache(cache: Record<string, GeocodeResult | null>): void {
  try {
    localStorage.setItem(BAIRRO_CACHE_KEY, JSON.stringify(cache))
  } catch {
    
  }
}

const inFlight = new Map<string, Promise<GeocodeResult | null>>()

export async function geocodeBairro(bairro: string): Promise<GeocodeResult | null> {
  const key = bairro.trim().toLowerCase()
  if (!key) return null

  const cache = readBairroCache()
  if (key in cache) return cache[key]

  const pending = inFlight.get(key)
  if (pending) return pending

  const request = geocodeAddress(bairro)
    .catch(() => null)
    .then((result) => {
      const latest = readBairroCache()
      latest[key] = result
      writeBairroCache(latest)
      inFlight.delete(key)
      return result
    })

  inFlight.set(key, request)
  return request
}
