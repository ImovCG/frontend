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

const CAMPINA_GRANDE_CENTER = { lat: -7.2306, lng: -35.8811 }

function hashJitter(seed: string): { lat: number; lng: number } {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  const latOffset = ((hash % 100) - 50) * 0.00015
  const lngOffset = (((hash >> 8) % 100) - 50) * 0.00015
  return { lat: latOffset, lng: lngOffset }
}

export function resolveCoordinates(
  bairro: string | null | undefined,
  id: string,
): { lat: number; lng: number } {
  const key = slugify(bairro ?? '')
  const base = NEIGHBORHOOD_COORDS[key] ?? CAMPINA_GRANDE_CENTER
  const jitter = hashJitter(id)

  return {
    lat: base.lat + jitter.lat,
    lng: base.lng + jitter.lng,
  }
}
