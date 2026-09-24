import { apiFetch, setToken } from '@/services/api'
import type { Anunciante, AuthResponse } from '@/types/anuncio'

export async function loginComGoogle(idToken: string): Promise<AuthResponse> {
  const resposta = await apiFetch<AuthResponse>('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })

  setToken(resposta.token)
  return resposta
}

export async function getPerfil(): Promise<Anunciante> {
  return apiFetch<Anunciante>('/api/auth/eu')
}

export async function salvarTelefone(telefone: string): Promise<Anunciante> {
  return apiFetch<Anunciante>('/api/auth/eu', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telefone }),
  })
}
