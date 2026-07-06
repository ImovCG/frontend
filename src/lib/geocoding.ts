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
