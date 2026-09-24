import { Route, Routes } from 'react-router-dom'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import Layout from '@/components/layout/Layout'
import { AuthProvider } from '@/context/AuthContext'
import { FavoritesProvider } from '@/context/FavoritesContext'
import AnuncioForm from '@/pages/AnuncioForm'
import Entrar from '@/pages/Entrar'
import Favorites from '@/pages/Favorites'
import Home from '@/pages/Home'
import MeusAnuncios from '@/pages/MeusAnuncios'

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/entrar" element={<Entrar />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/anunciar" element={<MeusAnuncios />} />
              <Route path="/anunciar/novo" element={<AnuncioForm />} />
              <Route path="/anunciar/:id/editar" element={<AnuncioForm />} />
            </Route>
          </Route>
        </Routes>
      </FavoritesProvider>
    </AuthProvider>
  )
}
