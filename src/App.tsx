import { Route, Routes } from 'react-router-dom'

import { FavoritesProvider } from '@/context/FavoritesContext'
import Layout from '@/components/layout/Layout'
import Home from '@/pages/Home'
import Favorites from '@/pages/Favorites'
import Alerts from '@/pages/Alerts'

export default function App() {
  return (
    <FavoritesProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/alertas" element={<Alerts />} />
        </Route>
      </Routes>
    </FavoritesProvider>
  )
}
