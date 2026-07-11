import { Bell, CheckCircle, SlidersHorizontal } from 'lucide-react'
import AlertsSection, { type AlertFeatureProps } from '@/components/home/AlertsSection'

const FEATURES: AlertFeatureProps[] = [
  {
    icon: <SlidersHorizontal size={20} />,
    title: 'Critérios personalizados',
    description: 'Defina bairro, preço, número de quartos e tipo de imóvel para receber apenas o que importa.',
  },
  {
    icon: <Bell size={20} />,
    title: 'Notificações em tempo real',
    description: 'Seja o primeiro a saber quando um imóvel dentro dos seus critérios for publicado.',
  },
  {
    icon: <CheckCircle size={20} />,
    title: 'Nunca perca uma oportunidade',
    description: 'Gerencie e pause alertas quando quiser, tudo em um só lugar.',
  },
]

export default function Alerts() {
  return (
    <AlertsSection
      title="Alertas de Imóveis"
      subtitle="Configure alertas e seja o primeiro a saber sobre novos imóveis."
      ctaLabel="Criar alerta gratuito"
      features={FEATURES}
    />
  )
}
