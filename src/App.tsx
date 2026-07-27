import { Route, Routes } from 'react-router-dom'

import { FavoritesProvider } from '@/context/FavoritesContext'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Favorites from '@/pages/Favorites'

export default function App() {
  return (
    <FavoritesProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/favoritos" element={<Favorites />} />
        </Route>
      </Routes>
    </FavoritesProvider>
  )
}
