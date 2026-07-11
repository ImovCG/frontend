import { cn } from '@/lib/utils'
import styles from '@/styles/layout/Section.module.css'

interface SectionProps {
  id?: string
  className?: string
  children: React.ReactNode
}

export default function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn(styles.section, className)}>
      <div className={styles.container}>{children}</div>
    </section>
  )
}
