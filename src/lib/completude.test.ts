import { describe, expect, it } from 'vitest'
import {
  getCampoCompletudeLabel,
  getStatusCompletudeLabel,
} from '@/lib/completude'

describe('completude labels', () => {
  it('translates known backend field codes', () => {
    expect(getCampoCompletudeLabel('areaM2')).toBe('área')
    expect(getCampoCompletudeLabel('descricao')).toBe('descrição')
    expect(getCampoCompletudeLabel('fotos')).toBe('fotos')
  })

  it('keeps unknown field codes visible as a fallback', () => {
    expect(getCampoCompletudeLabel('novoCampo')).toBe('novoCampo')
  })

  it('translates all completeness statuses and handles unavailable data', () => {
    expect(getStatusCompletudeLabel('INCOMPLETO')).toBe('Incompleto')
    expect(getStatusCompletudeLabel('PARCIALMENTE_COMPLETO')).toBe('Parcialmente completo')
    expect(getStatusCompletudeLabel('COMPLETO')).toBe('Completo')
    expect(getStatusCompletudeLabel(null)).toBe('Completude indisponível')
  })
})