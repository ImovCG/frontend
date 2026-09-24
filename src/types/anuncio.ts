export interface Anunciante {
  id: number
  nome: string
  email: string
  fotoUrl: string | null
  telefone: string | null
}

export interface AuthResponse {
  token: string
  expiraEm: number
  anunciante: Anunciante
}

/** Corpo enviado ao criar ou editar um anuncio proprio. */
export interface AnuncioPayload {
  titulo: string
  preco: number
  endereco: string
  bairro: string
  cidade?: string
  estado?: string
  tipoAnuncio: string
  categoria: string
  latitude?: number | null
  longitude?: number | null
  quartos?: number | null
  banheiros?: number | null
  areaM2?: number | null
  condominio?: number | null
  iptu?: number | null
  vagas?: number | null
  descricao?: string | null
  fotos?: string[]
}
