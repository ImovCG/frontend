import { describe, expect, it } from 'vitest'
import { formatDistance, formatDistanceLabel } from '@/lib/campuses'

describe('formatDistanceLabel', () => {
  it('formats the exact distance returned by the API', () => {
    expect(formatDistance(1.37)).toBe('1,4 km')
    expect(formatDistanceLabel({ km: 0.5, sigla: 'UFCG', aproximada: false })).toBe('0,5 km da UFCG')
  })

  it('marks neighborhood-based distances as approximate', () => {
    expect(formatDistanceLabel({ km: 2, sigla: 'UEPB', aproximada: true })).toBe('~2,0 km da UEPB')
  })
})
