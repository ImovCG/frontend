import { NavLink } from 'react-router-dom'
import { Bell, Heart, Home, Info } from 'lucide-react'
import styles from '@/styles/layout/Header.module.css'

const NAV_LINKS = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/favoritos', label: 'Favoritos', icon: Heart },
  { to: '/alertas', label: 'Alertas', icon: Bell },
  { to: '/como-funciona', label: 'Como funciona', icon: Info },
]

export default function Header() {
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
        </nav>
      </div>
    </header>
  )
}
