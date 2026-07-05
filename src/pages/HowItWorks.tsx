import { Bell, Heart, MapPin, Phone } from 'lucide-react'
import HowItWorksSection, { type StepProps } from '@/components/home/HowItWorksSection'

const STEPS: StepProps[] = [
  {
    step: 1,
    icon: <MapPin size={24} />,
    title: 'Explore o mapa',
    description: 'Navegue pelo mapa de Campina Grande e veja os imóveis disponíveis por bairro com preços em tempo real.',
  },
  {
    step: 2,
    icon: <Heart size={24} />,
    title: 'Salve favoritos',
    description: 'Marque os imóveis que mais gostou e acesse sua lista de favoritos a qualquer momento.',
  },
  {
    step: 3,
    icon: <Bell size={24} />,
    title: 'Configure alertas',
    description: 'Crie alertas para ser notificado quando novos imóveis corresponderem aos seus critérios.',
  },
  {
    step: 4,
    icon: <Phone size={24} />,
    title: 'Entre em contato',
    description: 'Acesse o anúncio completo e fale diretamente com o anunciante para fechar negócio.',
  },
]

export default function HowItWorks() {
  return (
    <HowItWorksSection
      title="Como funciona"
      subtitle="Encontre o imóvel ideal em Campina Grande em 4 passos simples."
      steps={STEPS}
    />
  )
}
