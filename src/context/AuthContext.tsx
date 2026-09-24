import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

import { ApiError, getToken, setToken } from '@/services/api'
import { getPerfil, loginComGoogle, salvarTelefone } from '@/services/auth'
import type { Anunciante } from '@/types/anuncio'

interface AuthContextValue {
  anunciante: Anunciante | null
  carregando: boolean
  entrarComGoogle: (idToken: string) => Promise<void>
  atualizarTelefone: (telefone: string) => Promise<void>
  sair: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [anunciante, setAnunciante] = useState<Anunciante | null>(null)
  const [carregando, setCarregando] = useState(() => getToken() != null)

  // Na primeira carga, confere se o token guardado ainda vale.
  useEffect(() => {
    if (getToken() == null) return

    let ativo = true

    getPerfil()
      .then((perfil) => {
        if (ativo) setAnunciante(perfil)
      })
      .catch((erro) => {
        if (erro instanceof ApiError && erro.status === 401) setToken(null)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const entrarComGoogle = useCallback(async (idToken: string) => {
    const resposta = await loginComGoogle(idToken)
    setAnunciante(resposta.anunciante)
  }, [])

  const atualizarTelefone = useCallback(async (telefone: string) => {
    setAnunciante(await salvarTelefone(telefone))
  }, [])

  const sair = useCallback(() => {
    setToken(null)
    setAnunciante(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ anunciante, carregando, entrarComGoogle, atualizarTelefone, sair }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
