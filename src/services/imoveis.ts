import { apiFetch } from '@/services/api'
import type { ImoveisFiltros, ImovelGetDTO, PageResponse } from '@/types/imovel'

function buildQuery(filtros: ImoveisFiltros): string {
  const params = new URLSearchParams()

  if (filtros.precoMin != null) params.set('precoMin', String(filtros.precoMin))
  if (filtros.precoMax != null) params.set('precoMax', String(filtros.precoMax))
  if (filtros.cidade) params.set('cidade', filtros.cidade)
  if (filtros.bairro) params.set('bairro', filtros.bairro)
  if (filtros.quartos != null) params.set('quartos', String(filtros.quartos))
  if (filtros.quartosMin != null) params.set('quartosMin', String(filtros.quartosMin))
  if (filtros.banheirosMin != null) params.set('banheirosMin', String(filtros.banheirosMin))
  if (filtros.areaMin != null) params.set('areaMin', String(filtros.areaMin))
  if (filtros.categoria) params.set('categoria', filtros.categoria)
  if (filtros.page != null) params.set('page', String(filtros.page))
  if (filtros.size != null) params.set('size', String(filtros.size))
  if (filtros.sort) params.set('sort', filtros.sort)
  if (filtros.fonte) params.set('fonte', filtros.fonte)


  const query = params.toString()
  return query ? `?${query}` : ''
}

export async function listImoveis(filtros: ImoveisFiltros = {}): Promise<PageResponse<ImovelGetDTO>> {
  return apiFetch<PageResponse<ImovelGetDTO>>(`/api/imoveis${buildQuery(filtros)}`)
}

export async function getImovelById(id: number): Promise<ImovelGetDTO> {
  return apiFetch<ImovelGetDTO>(`/api/imoveis/${id}`)
}
