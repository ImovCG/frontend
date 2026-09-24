/**
 * O link que o Google Drive oferece em "Compartilhar" aponta para uma pagina HTML, nao para o
 * arquivo: usado direto num <img> ele nao carrega. Aqui trocamos esses formatos pelo endpoint
 * que devolve a imagem em si.
 *
 * Formatos aceitos:
 *   https://drive.google.com/file/d/<ID>/view?usp=sharing
 *   https://drive.google.com/open?id=<ID>
 *   https://drive.google.com/uc?export=view&id=<ID>
 *   https://docs.google.com/uc?id=<ID>
 */
const PADROES_DRIVE = [
  /drive\.google\.com\/file\/d\/([\w-]+)/,
  /(?:drive|docs)\.google\.com\/[^?]*\?(?:[^#]*&)?id=([\w-]+)/,
]

/** Largura pedida ao Drive: suficiente para o card e para a foto aberta no detalhe. */
const LARGURA_DRIVE = 1600

export function extrairIdDoDrive(url: string): string | null {
  for (const padrao of PADROES_DRIVE) {
    const encontrado = url.match(padrao)
    if (encontrado) return encontrado[1]
  }
  return null
}

/**
 * Normaliza a URL informada pelo anunciante. Links que nao sao do Drive passam intactos.
 */
export function normalizarUrlImagem(url: string): string {
  const limpa = url.trim()
  if (!limpa) return limpa

  const idDrive = extrairIdDoDrive(limpa)
  if (!idDrive) return limpa

  return `https://drive.google.com/thumbnail?id=${idDrive}&sz=w${LARGURA_DRIVE}`
}

export function ehLinkDoDrive(url: string): boolean {
  return extrairIdDoDrive(url) != null
}
