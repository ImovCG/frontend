export type PropertyStatus = 'Disponível' | 'Em análise' | 'Vendido' | 'Reservado'

// TODO: remover fallback quando webscraping preencher sourceUrl real por imóvel
export const FALLBACK_SOURCE_URL = 'https://www.olx.com.br'

// Best-effort parser for anúncio price strings ("R$ 750.000", "750 mil", "1,2 milhão", "A combinar").
// Returns null when the price can't be read as a number (caller should treat that as "unknown", not zero).
export function parsePriceToNumber(price: string): number | null {
  const lower = price.toLowerCase().trim()
  if (!/\d/.test(lower)) return null

  const suffixMatch = lower.match(/milh[aã]o|milh[oõ]es|\bmi\b|\bmil\b/)
  const numberMatch = lower.match(/[\d.,]+/)
  if (!numberMatch) return null

  const numeric = parseFloat(numberMatch[0].replace(/\./g, '').replace(',', '.'))
  if (Number.isNaN(numeric)) return null

  if (!suffixMatch) return numeric
  const isMillion = suffixMatch[0].startsWith('milh') || suffixMatch[0] === 'mi'
  return numeric * (isMillion ? 1_000_000 : 1_000)
}
