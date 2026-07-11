import { FALLBACK_SOURCE_URL, type PropertyStatus } from '@/lib/property'

interface PropertyActionsProps {
  status: PropertyStatus
  sourceUrl?: string
  viewClassName: string
  statusClassName: string
}

export default function PropertyActions({ status, sourceUrl, viewClassName, statusClassName }: PropertyActionsProps) {
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
      <span className={statusClassName}>{status}</span>
    </>
  )
}
