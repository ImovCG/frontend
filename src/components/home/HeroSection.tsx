import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Section from '@/components/layout/Section'
import styles from '@/styles/home/HeroSection.module.css'

interface HeroSectionProps {
  title: string
  subtitle: string
  searchPlaceholder: string
  ctaLabel: string
  onSearch?: (query: string) => void
  onCtaClick?: () => void
}

export default function HeroSection({
  title,
  subtitle,
  searchPlaceholder,
  ctaLabel,
  onSearch,
  onCtaClick,
}: HeroSectionProps) {
  return (
    <Section id="inicio" className={styles.sectionBg}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.searchWrapper}>
          <div className={styles.inputWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch?.(e.target.value)}
              className={styles.input}
            />
          </div>
          <Button onClick={onCtaClick}>{ctaLabel}</Button>
        </div>
      </div>
    </Section>
  )
}
