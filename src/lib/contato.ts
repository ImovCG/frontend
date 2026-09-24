/** Fonte dos imoveis cadastrados pelo proprio anunciante, em oposicao aos coletados. */
export const FONTE_PROPRIA = 'imovcg'

export function ehAnuncioProprio(fonte?: string): boolean {
  return fonte?.toLowerCase() === FONTE_PROPRIA
}

/** "(83) 99999-0000" -> "5583999990000". Devolve null quando nao da para discar. */
export function normalizarTelefone(telefone?: string | null): string | null {
  const digitos = telefone?.replace(/\D/g, '') ?? ''
  if (digitos.length < 10) return null

  // Numero brasileiro sem o 55 na frente: acrescenta o codigo do pais.
  return digitos.length <= 11 ? `55${digitos}` : digitos
}

export function formatarTelefone(telefone?: string | null): string | null {
  const digitos = telefone?.replace(/\D/g, '') ?? ''

  if (digitos.length === 11) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`
  }
  if (digitos.length === 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`
  }

  return telefone?.trim() || null
}

export function linkWhatsApp(telefone: string | null | undefined, titulo: string): string | null {
  const numero = normalizarTelefone(telefone)
  if (!numero) return null

  const texto = encodeURIComponent(
    `Olá! Vi seu anúncio "${titulo}" no imovCG e queria saber mais.`,
  )
  return `https://wa.me/${numero}?text=${texto}`
}
