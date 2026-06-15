import type { ReactNode } from 'react'
import Section from '@/components/layout/Section'
import SectionHeader from '@/components/layout/SectionHeader'
import styles from '@/styles/home/HowItWorksSection.module.css'

export interface StepProps {
  step: number
  icon: ReactNode
  title: string
  description: string
}

interface HowItWorksSectionProps {
  title: string
  subtitle?: string
  steps: StepProps[]
}

export default function HowItWorksSection({ title, subtitle, steps }: HowItWorksSectionProps) {
  return (
    <Section id="como-funciona" className={styles.sectionBg}>
      <SectionHeader title={title} subtitle={subtitle} />
      <div className={styles.grid}>
        {steps.map((step) => (
          <div key={step.step} className={styles.step}>
            <div className={styles.iconWrapper}>
              <div className={styles.icon}>{step.icon}</div>
              <span className={styles.stepNumber}>{step.step}</span>
            </div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
