import { geocodeBairro } from '@/lib/geocoding'

const ACCENT_MAP: Record<string, string> = {
  á: 'a', à: 'a', â: 'a', ã: 'a', ä: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  í: 'i', ì: 'i', î: 'i', ï: 'i',
  ó: 'o', ò: 'o', ô: 'o', õ: 'o', ö: 'o',
  ú: 'u', ù: 'u', û: 'u', ü: 'u',
  ç: 'c', ñ: 'n',
}

export function slugify(text: string): string {
  const plain = text
    .toLowerCase()
    .split('')
    .map((ch) => ACCENT_MAP[ch] ?? ch)
    .join('')
  return plain.trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// Known-good centroids for the busiest bairros — served instantly, no network round trip.
// Anything outside this list falls through to geocodeBairro (cached after first lookup).
const NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number }> = {
  universitario: { lat: -7.2190, lng: -35.8945 },
  bodocongo: { lat: -7.2430, lng: -35.9100 },
  'tres-irmaos': { lat: -7.2150, lng: -35.8720 },
  centenario: { lat: -7.2130, lng: -35.8680 },
  catole: { lat: -7.2240, lng: -35.8860 },
  'jardim-tavares': { lat: -7.2350, lng: -35.8780 },
  'alto-branco': { lat: -7.2080, lng: -35.8850 },
  mirante: { lat: -7.2170, lng: -35.9050 },
  'nova-brasilia': { lat: -7.2280, lng: -35.9000 },
  'sao-jose': { lat: -7.2400, lng: -35.8750 },
}

export const CAMPINA_GRANDE_CENTER = { lat: -7.2306, lng: -35.8811 }

// Resolves a bairro's midpoint: static table first, then a cached Nominatim lookup, falling
// back to the city center only if the bairro is empty or the lookup fails outright.
export async function resolveCoordinates(
  bairro: string | null | undefined,
): Promise<{ lat: number; lng: number }> {
  const trimmed = bairro?.trim()
  if (!trimmed) return CAMPINA_GRANDE_CENTER

  const key = slugify(trimmed)
  const known = NEIGHBORHOOD_COORDS[key]
  if (known) return known

  const geocoded = await geocodeBairro(trimmed)
  return geocoded ?? CAMPINA_GRANDE_CENTER
}
