import type { CampoCompletude, StatusCompletude } from '@/types/imovel'
import { getCampoCompletudeLabel, getStatusCompletudeLabel } from '@/lib/completude'
import styles from '@/styles/home/CompletenessIndicator.module.css'

type CompletenessVariant = 'light' | 'dark'

interface CompletenessIndicatorProps {
  completude?: number | null
  statusCompletude?: StatusCompletude | null
  camposFaltantes?: CampoCompletude[]
  compact?: boolean
  variant?: CompletenessVariant
}

export default function CompletenessIndicator({
  completude,
  statusCompletude,
  camposFaltantes = [],
  compact = false,
  variant = 'light',
}: CompletenessIndicatorProps) {
  if (completude == null) return null

  const percentage = Math.min(100, Math.max(0, Math.round(completude)))
  const status = getStatusCompletudeLabel(statusCompletude)
  const missing = camposFaltantes.map(getCampoCompletudeLabel)

  const className = [
    compact ? styles.compact : styles.wrapper,
    variant === 'dark' ? styles.dark : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className} aria-label={`Completude: ${percentage}%, ${status}`}>
      <div className={styles.heading}>
        <span className={styles.label}>Completude:</span>
        <strong>{percentage}%</strong>
        <span className={styles.status}>{status}</span>
      </div>
      {!compact && statusCompletude !== 'COMPLETO' && missing.length > 0 && (
        <p className={styles.missing}>Faltam: {missing.join(', ')}.</p>
      )}
    </div>
  )
}