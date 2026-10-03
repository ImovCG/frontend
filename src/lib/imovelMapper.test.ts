import { describe, expect, it, vi } from 'vitest'
import { mapImovelToProperty } from '@/lib/imovelMapper'
import type { ImovelGetDTO } from '@/types/imovel'

vi.mock('@/lib/neighborhoodCoords', () => ({
  resolveCoordinates: vi.fn().mockResolvedValue(null),
  slugify: (value: string) => value.toLowerCase().replaceAll(' ', '-'),
}))

const baseImovel: ImovelGetDTO = {
  id: 42,
  externalId: 'external-42',
  fonte: 'manual',
  titulo: 'Apartamento próximo à UFCG',
  preco: 250000,
  endereco: 'Rua A',
  url: '',
  estado: 'PB',
  tipoAnuncio: 'venda',
  categoria: 'apartamento',
  cidade: 'Campina Grande',
  bairro: 'Universitário',
  latitude: -7.2,
  longitude: -35.9,
  quartos: null,
  banheiros: 1,
  areaM2: null,
  condominio: null,
  iptu: null,
  vagas: null,
  dataColeta: '2026-01-01T00:00:00Z',
  descricao: null,
  fotos: [],
  anuncianteNome: null,
  anuncianteTelefone: null,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  completude: 72,
  statusCompletude: 'PARCIALMENTE_COMPLETO',
  camposFaltantes: ['quartos', 'areaM2', 'descricao', 'fotos'],
}

describe('mapImovelToProperty', () => {
  it('preserves backend completeness and missing values', async () => {
    const property = await mapImovelToProperty(baseImovel)

    expect(property.completude).toBe(72)
    expect(property.statusCompletude).toBe('PARCIALMENTE_COMPLETO')
    expect(property.camposFaltantes).toEqual(['quartos', 'areaM2', 'descricao', 'fotos'])
    expect(property.beds).toBeUndefined()
    expect(property.area).toBeUndefined()
    expect(property.baths).toBe(1)
  })
})