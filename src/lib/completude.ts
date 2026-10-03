import type { CampoCompletude, StatusCompletude } from '@/types/imovel'

export const STATUS_COMPLETUDE_LABEL: Record<StatusCompletude, string> = {
  INCOMPLETO: 'Incompleto',
  PARCIALMENTE_COMPLETO: 'Parcialmente completo',
  COMPLETO: 'Completo',
}

const CAMPO_LABELS: Record<string, string> = {
  titulo: 'título',
  preco: 'preço',
  tipoAnuncio: 'tipo de anúncio',
  categoria: 'categoria',
  endereco: 'endereço',
  bairro: 'bairro',
  cidade: 'cidade',
  estado: 'estado',
  quartos: 'quartos',
  banheiros: 'banheiros',
  areaM2: 'área',
  vagas: 'vagas',
  descricao: 'descrição',
  fotos: 'fotos',
}

export function getCampoCompletudeLabel(campo: CampoCompletude | string): string {
  return CAMPO_LABELS[campo] ?? campo
}

export function getStatusCompletudeLabel(status: StatusCompletude | null | undefined): string {
  return status ? STATUS_COMPLETUDE_LABEL[status] ?? status : 'Completude indisponível'
}