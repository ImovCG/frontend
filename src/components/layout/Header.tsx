import { Bell, Heart, Home, Info } from 'lucide-react'
import styles from '@/styles/layout/Header.module.css'

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio', icon: Home },
  { href: '#favoritos', label: 'Favoritos', icon: Heart },
  { href: '#alertas', label: 'Alertas', icon: Bell },
  { href: '#como-funciona', label: 'Como funciona', icon: Info },
]

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href="#inicio" className={styles.logo}>
          <img src="/logo.svg" alt="imovCG" className={styles.logoImg} />
        </a>
        <nav className={styles.nav}>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <a key={href} href={href} className={styles.navLink}>
              <Icon className={styles.navIcon} />
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
