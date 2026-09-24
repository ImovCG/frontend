import { MessageCircle } from 'lucide-react'

import { ehAnuncioProprio, linkWhatsApp } from '@/lib/contato'
import { FALLBACK_SOURCE_URL } from '@/lib/property'

interface PropertyActionsProps {
  tipoAnuncio?: string
  sourceUrl?: string
  fonte?: string
  titulo: string
  anuncianteNome?: string
  anuncianteTelefone?: string
  viewClassName: string
  badgeClassName: string
}

export default function PropertyActions({
  tipoAnuncio,
  sourceUrl,
  fonte,
  titulo,
  anuncianteTelefone,
  viewClassName,
  badgeClassName,
}: PropertyActionsProps) {
  const proprio = ehAnuncioProprio(fonte)
  const whatsapp = proprio ? linkWhatsApp(anuncianteTelefone, titulo) : null

  return (
    <>
      {proprio ? (
        <button
          className={viewClassName}
          disabled={!whatsapp}
          onClick={(e) => {
            e.stopPropagation()
            // Anuncio nosso: nao ha pagina de origem para abrir, o contato e direto.
            if (whatsapp) window.open(whatsapp, '_blank', 'noopener,noreferrer')
          }}
        >
          <MessageCircle className="h-3 w-3" />
          {whatsapp ? 'Falar com o anunciante' : 'Contato indisponível'}
        </button>
      ) : (
        <button
          className={viewClassName}
          onClick={(e) => {
            e.stopPropagation()
            window.open(sourceUrl || FALLBACK_SOURCE_URL, '_blank', 'noopener,noreferrer')
          }}
        >
          Ver anúncio
        </button>
      )}
      {tipoAnuncio && <span className={badgeClassName}>{tipoAnuncio}</span>}
    </>
  )
}
