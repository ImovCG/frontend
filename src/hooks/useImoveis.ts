import { useEffect, useState } from 'react'
import type { PropertyCardProps } from '@/components/home/PropertyCard'
import { mapImovelToProperty } from '@/lib/imovelMapper'
import { listImoveis } from '@/services/imoveis'
import type { ImoveisFiltros } from '@/types/imovel'

interface UseImoveisResult {
  properties: PropertyCardProps[]
  loading: boolean
  error: string | null
  totalElements: number
  refetch: () => void
}

export function useImoveis(filtros: ImoveisFiltros = {}): UseImoveisResult {
  const [properties, setProperties] = useState<PropertyCardProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalElements, setTotalElements] = useState(0)
  const [reloadToken, setReloadToken] = useState(0)

  const filtersKey = JSON.stringify(filtros)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const page = await listImoveis({ size: 200, ...filtros })
        if (cancelled) return

        const mapped = await Promise.all(page.content.map(mapImovelToProperty))
        if (cancelled) return

        setProperties(mapped)
        setTotalElements(page.totalElements)
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Não foi possível carregar os imóveis.'
        setError(message)
        setProperties([])
        setTotalElements(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [filtersKey, reloadToken])

  return {
    properties,
    loading,
    error,
    totalElements,
    refetch: () => setReloadToken((value) => value + 1),
  }
}
