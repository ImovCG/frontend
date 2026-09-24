import { apiFetch } from '@/services/api'
import type { AnuncioPayload } from '@/types/anuncio'
import type { ImovelGetDTO } from '@/types/imovel'

const BASE = '/api/anunciante/imoveis'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export async function listarMeusAnuncios(): Promise<ImovelGetDTO[]> {
  return apiFetch<ImovelGetDTO[]>(BASE)
}

export async function getMeuAnuncio(id: number): Promise<ImovelGetDTO> {
  return apiFetch<ImovelGetDTO>(`${BASE}/${id}`)
}

export async function criarAnuncio(payload: AnuncioPayload): Promise<ImovelGetDTO> {
  return apiFetch<ImovelGetDTO>(BASE, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  })
}

export async function atualizarAnuncio(id: number, payload: AnuncioPayload): Promise<ImovelGetDTO> {
  return apiFetch<ImovelGetDTO>(`${BASE}/${id}`, {
    method: 'PUT',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  })
}

export async function excluirAnuncio(id: number): Promise<void> {
  return apiFetch<void>(`${BASE}/${id}`, { method: 'DELETE' })
}
