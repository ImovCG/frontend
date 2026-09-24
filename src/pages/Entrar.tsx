import { useEffect, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { MapPin, MessageCircle, ShieldCheck, Store } from 'lucide-react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'
import styles from '@/styles/anunciante/Entrar.module.css'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

const VANTAGENS = [
  {
    icone: MapPin,
    titulo: 'Seu imóvel no mapa',
    texto: 'O anúncio entra no mesmo mapa que o estudante já usa para procurar, com filtro de bairro e distância do campus.',
  },
  {
    icone: MessageCircle,
    titulo: 'Contato direto',
    texto: 'Quem se interessar fala com você. Sem intermediário, sem comissão, sem taxa de anúncio.',
  },
  {
    icone: Store,
    titulo: 'Você no controle',
    texto: 'Publique, edite o preço e tire do ar quando alugar — tudo pelo painel, na hora que quiser.',
  },
]

export default function Entrar() {
  const { anunciante, entrarComGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [erro, setErro] = useState<string | null>(null)

  const destino = (location.state as { de?: string } | null)?.de ?? '/anunciar'

  useEffect(() => {
    if (anunciante) navigate(destino, { replace: true })
  }, [anunciante, destino, navigate])

  if (anunciante) return <Navigate to={destino} replace />

  async function aoReceberCredencial(idToken: string | undefined) {
    if (!idToken) {
      setErro('O Google não devolveu as credenciais. Tente novamente.')
      return
    }

    setErro(null)

    try {
      await entrarComGoogle(idToken)
    } catch {
      setErro('Não foi possível entrar. Tente novamente em instantes.')
    }
  }

  return (
    <main className={styles.page}>
      {/* Painel de apresentacao: mesma cor do header, com a malha do mapa ao fundo. */}
      <section className={styles.vitrine}>
        <div className={styles.malha} aria-hidden="true" />

        <div className={styles.vitrineConteudo}>
          <span className={styles.selo}>Para proprietários e imobiliárias</span>

          <h1 className={styles.vitrineTitulo}>
            Anuncie seu imóvel para quem está <em className={styles.destaque}>procurando agora</em>
          </h1>

          <p className={styles.vitrineTexto}>
            Todo mês, estudantes da UFCG, UEPB e IFPB chegam a Campina Grande atrás de aluguel.
            Coloque seu imóvel na frente deles.
          </p>

          <ul className={styles.vantagens}>
            {VANTAGENS.map(({ icone: Icone, titulo, texto }) => (
              <li key={titulo} className={styles.vantagem}>
                <span className={styles.vantagemIcone}>
                  <Icone className={styles.icone} />
                </span>
                <div>
                  <p className={styles.vantagemTitulo}>{titulo}</p>
                  <p className={styles.vantagemTexto}>{texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Coluna do login. */}
      <section className={styles.acesso}>
        <div className={styles.card}>
          <img src="/logo.svg" alt="imovCG" className={styles.logo} />

          <h2 className={styles.cardTitulo}>Entrar como anunciante</h2>
          <p className={styles.cardTexto}>
            Use sua conta Google. Não precisa criar senha nem preencher cadastro.
          </p>

          <div className={styles.googleBox}>
            {CLIENT_ID ? (
              <GoogleLogin
                onSuccess={(cred) => aoReceberCredencial(cred.credential)}
                onError={() => setErro('O login com o Google falhou. Tente novamente.')}
                text="continue_with"
                shape="pill"
                width="300"
              />
            ) : (
              <p className={styles.erro}>
                O login não está configurado: falta definir <code>VITE_GOOGLE_CLIENT_ID</code>.
              </p>
            )}
          </div>

          {erro && <p className={styles.erro} role="alert">{erro}</p>}

          <p className={styles.gratis}>Anunciar no imovCG é gratuito.</p>

          <div className={styles.privacidade}>
            <ShieldCheck className={styles.privacidadeIcone} />
            <p>
              Usamos sua conta Google apenas para identificar você como anunciante. Não publicamos
              nada em seu nome e não compartilhamos seu e-mail com quem visita o site.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
