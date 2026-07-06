import { createPortal } from 'react-dom'
import { MapPin } from 'lucide-react'
import styles from '@/styles/layout/HowItWorksModal.module.css'

interface Step {
  title: string
  description: string
}

const STEPS: Step[] = [
  {
    title: 'Coletamos automaticamente',
    description: 'Rastreamos OLX e grupos do Facebook toda semana e reunimos tudo num só lugar',
  },
  {
    title: 'Você filtra pelo que importa',
    description: 'Preço, quartos, bairro, distância da UFCG ou do trabalho.',
  },
  {
    title: 'Veja no mapa interativo',
    description: 'Todos os imóveis aparecem mapeados com preços e características.',
  },
  {
    title: 'Contato direto com o anunciante',
    description: 'Gostou? Clique e vá direto ao anúncio original para negociar. Nenhum intermediário, nenhuma taxa.',
  },
]

interface HowItWorksModalProps {
  onClose: () => void
}

export default function HowItWorksModal({ onClose }: HowItWorksModalProps) {
  function handleDontShowAgain() {
    localStorage.setItem('hideHowItWorks', '1')
    onClose()
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.iconWrapper}>
            <MapPin className={styles.icon} />
          </span>
          <div>
            <h2 className={styles.title}>Como o imovCG funciona</h2>
            <p className={styles.subtitle}>Encontre seu imóvel em 4 passos simples</p>
          </div>
        </div>

        <div className={styles.body}>
          {STEPS.map((step, i) => (
            <div key={step.title} className={styles.step}>
              <div className={styles.stepMarker}>
                <span className={styles.stepNumber}>{i + 1}</span>
                {i < STEPS.length - 1 && <span className={styles.stepLine} />}
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button className={styles.dontShow} onClick={handleDontShowAgain}>
            Não mostrar novamente
          </button>
          <button className={styles.searchBtn} onClick={onClose}>
            Buscar imóveis
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
