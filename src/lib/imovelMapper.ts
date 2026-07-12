import type { PropertyCardProps } from '@/components/home/PropertyCard'
import type { ImovelGetDTO } from '@/types/imovel'
import { resolveCoordinates, slugify } from '@/lib/neighborhoodCoords'

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x250/e2e8f0/64748b?text=Sem+foto'

export function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatTipoAnuncio(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
}

function buildLocation(imovel: ImovelGetDTO): string {
  const bairro = imovel.bairro?.trim()
  const cidade = imovel.cidade?.trim() ?? 'Campina Grande'
  const uf = imovel.estado?.trim() ?? 'PB'

  if (bairro) return `${bairro}, ${cidade} - ${uf}`
  if (imovel.endereco) return `${imovel.endereco}, ${cidade} - ${uf}`
  return `${cidade} - ${uf}`
}

export function mapImovelToProperty(imovel: ImovelGetDTO): PropertyCardProps {
  const id = String(imovel.id)
  const { lat, lng } = resolveCoordinates(imovel.bairro, id)

  return {
    id,
    image: imovel.fotos?.[0] ?? PLACEHOLDER_IMAGE,
    title: imovel.titulo,
    price: formatPrice(imovel.preco),
    location: buildLocation(imovel),
    beds: imovel.quartos ?? 0,
    baths: imovel.banheiros ?? 0,
    area: imovel.areaM2 ?? 0,
    lat,
    lng,
    neighborhoodId: imovel.bairro ? slugify(imovel.bairro) : undefined,
    sourceUrl: imovel.url,
    description: imovel.descricao ?? undefined,
    categoria: imovel.categoria ?? undefined,
    tipoAnuncio: imovel.tipoAnuncio ? formatTipoAnuncio(imovel.tipoAnuncio) : undefined,
  }
}
