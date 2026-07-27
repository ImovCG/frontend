import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Heart, Home, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import HowItWorksModal from '@/components/layout/HowItWorksModal'
import styles from '@/styles/layout/Header.module.css'

const NAV_LINKS = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/favoritos', label: 'Favoritos', icon: Heart },
]

export default function Header() {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <NavLink to="/" className={styles.logo}>
          <img src="/logo.svg" alt="imovCG" className={styles.logoImg} />
        </NavLink>
        <nav className={styles.nav}>
          {NAV_LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              <Icon className={styles.navIcon} />
              {label}
            </NavLink>
          ))}
          <button
            className={cn(styles.navLink, isHowItWorksOpen && styles.navLinkActive)}
            onClick={() => setIsHowItWorksOpen(true)}
          >
            <Info className={styles.navIcon} />
            Como funciona
          </button>
        </nav>
      </div>

      {isHowItWorksOpen && (
        <HowItWorksModal onClose={() => setIsHowItWorksOpen(false)} />
      )}
    </header>
  )
}
