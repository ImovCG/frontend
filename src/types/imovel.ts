export interface ImovelGetDTO {
  id: number
  externalId: string
  fonte: string
  titulo: string
  preco: number
  endereco: string
  url: string
  estado: string | null
  tipoAnuncio: string | null
  categoria: string | null
  cidade: string | null
  bairro: string | null
  latitude: number | null
  longitude: number | null
  /** Distância em linha reta até a universidade informada na busca (null sem coordenadas ou sem universidade). */
  distanciaUniversidadeKm?: number | null
  quartos: number | null
  banheiros: number | null
  areaM2: number | null
  condominio: number | null
  iptu: number | null
  vagas: number | null
  dataColeta: string
  descricao: string | null
  fotos: string[]
  anuncianteNome: string | null
  anuncianteTelefone: string | null
  createdAt: string
  updatedAt: string
  completude: number | null
  statusCompletude: StatusCompletude | null
  camposFaltantes: CampoCompletude[]
}

export type StatusCompletude =
  | 'INCOMPLETO'
  | 'PARCIALMENTE_COMPLETO'
  | 'COMPLETO'

export type CampoCompletude =
  | 'titulo'
  | 'preco'
  | 'tipoAnuncio'
  | 'categoria'
  | 'endereco'
  | 'bairro'
  | 'cidade'
  | 'estado'
  | 'quartos'
  | 'banheiros'
  | 'areaM2'
  | 'vagas'
  | 'descricao'
  | 'fotos'
  | (string & {})

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

export interface ImoveisFiltros {
  precoMin?: number
  precoMax?: number
  cidade?: string
  bairro?: string
  quartos?: number
  quartosMin?: number
  banheirosMin?: number
  areaMin?: number
  categoria?: string
  page?: number
  size?: number
  sort?: string
  fonte?: string
  /** Sigla da universidade de referência: UFCG, UEPB ou IFPB. */
  universidade?: string
  distanciaMaximaKm?: number
}
