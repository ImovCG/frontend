import type { ReactNode } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Section from '@/components/layout/Section'
import SectionHeader from '@/components/layout/SectionHeader'
import styles from '@/styles/home/AlertsSection.module.css'

export interface AlertFeatureProps {
  icon: ReactNode
  title: string
  description: string
}

interface AlertsSectionProps {
  title: string
  subtitle?: string
  ctaLabel: string
  features: AlertFeatureProps[]
  onCtaClick?: () => void
}

export default function AlertsSection({
  title,
  subtitle,
  ctaLabel,
  features,
  onCtaClick,
}: AlertsSectionProps) {
  return (
    <Section id="alertas" className={styles.sectionBg}>
      <div className={styles.grid}>
        <div>
          <SectionHeader title={title} subtitle={subtitle} className={styles.sectionHeaderOverride} />
          <div className={styles.featureList}>
            {features.map((feat, i) => (
              <div key={i} className={styles.feature}>
                <div className={styles.featureIcon}>{feat.icon}</div>
                <div>
                  <h4 className={styles.featureTitle}>{feat.title}</h4>
                  <p className={styles.featureDescription}>{feat.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Button className={styles.cta} onClick={onCtaClick}>
            {ctaLabel}
          </Button>
        </div>
        <div className={styles.illustration}>
          <div className={styles.illustrationIcon}>
            <Bell className={styles.bellIcon} />
          </div>
          <p className={styles.illustrationText}>
            Receba notificações instantâneas quando novos imóveis corresponderem aos seus critérios.
          </p>
        </div>
      </div>
    </Section>
  )
}
