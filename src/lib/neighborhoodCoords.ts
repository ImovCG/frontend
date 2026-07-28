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

// Known-good centroids for bairros in Campina Grande. Keep this deterministic: browser-side
// geocoding can return inconsistent or overly broad results for neighborhood-only searches.
const NEIGHBORHOOD_COORDS: Record<string, { lat: number; lng: number }> = {
  centro: { lat: -7.2210, lng: -35.8810 },
  universitario: { lat: -7.2190, lng: -35.8945 },
  bodocongo: { lat: -7.2430, lng: -35.9100 },
  'novo-bodocongo': { lat: -7.2380, lng: -35.9250 },
  'tres-irmas': { lat: -7.2740, lng: -35.9360 },
  'tres-irmaos': { lat: -7.2740, lng: -35.9360 },
  centenario: { lat: -7.2130, lng: -35.8680 },
  catole: { lat: -7.2240, lng: -35.8860 },
  itarare: { lat: -7.2360, lng: -35.8800 },
  'jardim-tavares': { lat: -7.2350, lng: -35.8780 },
  'alto-branco': { lat: -7.2080, lng: -35.8850 },
  mirante: { lat: -7.2170, lng: -35.9050 },
  'nova-brasilia': { lat: -7.2280, lng: -35.9000 },
  'sao-jose': { lat: -7.2400, lng: -35.8750 },
  prata: { lat: -7.2240, lng: -35.8920 },
  liberdade: { lat: -7.2410, lng: -35.8980 },
  cruzeiro: { lat: -7.2410, lng: -35.9100 },
  malvinas: { lat: -7.2220, lng: -35.9480 },
  serrotao: { lat: -7.2580, lng: -35.9350 },
  tambor: { lat: -7.2440, lng: -35.8950 },
  'santa-rosa': { lat: -7.2300, lng: -35.9070 },
  'monte-santo': { lat: -7.2110, lng: -35.9020 },
  'jardim-paulistano': { lat: -7.2320, lng: -35.8890 },
  'vila-cabral': { lat: -7.2490, lng: -35.9220 },
  'bela-vista': { lat: -7.2190, lng: -35.8700 },
  conceicao: { lat: -7.2140, lng: -35.8740 },
  'bento-figueiredo': { lat: -7.2290, lng: -35.8660 },
  'aluizio-campos': { lat: -7.2960, lng: -35.9370 },
  'jose-pinheiro': { lat: -7.2290, lng: -35.8730 },
  'sandra-cavalcante': { lat: -7.2460, lng: -35.8840 },
  'bairro-das-cidades': { lat: -7.2580, lng: -35.8850 },
  dinamerica: { lat: -7.2300, lng: -35.9170 },
  palmeira: { lat: -7.2120, lng: -35.8930 },
  'santo-antonio': { lat: -7.2250, lng: -35.8720 },
  'distrito-industrial': { lat: -7.2720, lng: -35.9070 },
  'jardim-quarenta': { lat: -7.2340, lng: -35.8990 },
  nacoes: { lat: -7.2050, lng: -35.8910 },
  velame: { lat: -7.2670, lng: -35.8940 },
  quarenta: { lat: -7.2320, lng: -35.8950 },
  'santa-cruz': { lat: -7.2500, lng: -35.8910 },
}

export const CAMPINA_GRANDE_CENTER = { lat: -7.2306, lng: -35.8811 }

// Resolves a bairro's midpoint. Unknown bairros fall back to the city center instead of
// geocoding in the browser, avoiding incorrect markers outside Campina Grande.
export async function resolveCoordinates(
  bairro: string | null | undefined,
): Promise<{ lat: number; lng: number }> {
  const trimmed = bairro?.trim()
  if (!trimmed) return CAMPINA_GRANDE_CENTER

  const key = slugify(trimmed)
  const known = NEIGHBORHOOD_COORDS[key]
  if (known) return known

  return CAMPINA_GRANDE_CENTER
}
