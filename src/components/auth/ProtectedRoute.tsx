import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'

/**
 * Porteiro das rotas do anunciante. O resto do site continua aberto a qualquer visitante.
 */
export default function ProtectedRoute() {
  const { anunciante, carregando } = useAuth()
  const location = useLocation()

  if (carregando) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</p>
  }

  if (!anunciante) {
    return <Navigate to="/entrar" replace state={{ de: location.pathname }} />
  }

  return <Outlet />
}
