import { cleanup, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CompletenessIndicator from '@/components/home/CompletenessIndicator'

describe('CompletenessIndicator', () => {
  it('renders the percentage, status, and missing fields', () => {
    render(
      <CompletenessIndicator
        completude={72}
        statusCompletude="PARCIALMENTE_COMPLETO"
        camposFaltantes={['areaM2', 'descricao', 'fotos']}
      />,
    )

    expect(screen.getByLabelText('Completude: 72%, Parcialmente completo')).toBeInTheDocument()
    expect(screen.getByText('Faltam: área, descrição, fotos.')).toBeInTheDocument()
  })

  it('renders all status variants and does not render missing fields for a complete property', () => {
    render(
      <CompletenessIndicator completude={0} statusCompletude="INCOMPLETO" />,
    )
    expect(screen.getByText('Incompleto')).toBeInTheDocument()

    cleanup()
    render(<CompletenessIndicator completude={80} statusCompletude="COMPLETO" />)
    expect(screen.getByText('Completo')).toBeInTheDocument()
    expect(screen.queryByText(/Faltam:/)).not.toBeInTheDocument()
  })

  it('does not invent a score when the backend has not returned one', () => {
    const { container } = render(<CompletenessIndicator completude={null} />)
    expect(container).toBeEmptyDOMElement()
  })
})