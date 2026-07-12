import { FALLBACK_SOURCE_URL } from '@/lib/property'

interface PropertyActionsProps {
  tipoAnuncio?: string
  sourceUrl?: string
  viewClassName: string
  badgeClassName: string
}

export default function PropertyActions({
  tipoAnuncio,
  sourceUrl,
  viewClassName,
  badgeClassName,
}: PropertyActionsProps) {
  return (
    <>
      <button
        className={viewClassName}
        onClick={(e) => {
          e.stopPropagation()
          window.open(sourceUrl || FALLBACK_SOURCE_URL, '_blank', 'noopener,noreferrer')
        }}
      >
        Ver anúncio
      </button>
      {tipoAnuncio && <span className={badgeClassName}>{tipoAnuncio}</span>}
    </>
  )
}
