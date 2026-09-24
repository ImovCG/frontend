import { useEffect, useState } from 'react'
import { Bath, BedDouble, Home, LogOut, Pencil, Plus, Ruler, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import ContatoCard from '@/components/anunciante/ContatoCard'
import { useAuth } from '@/context/AuthContext'
import { PLACEHOLDER_IMAGE } from '@/lib/imovelMapper'
import { excluirAnuncio, listarMeusAnuncios } from '@/services/anuncios'
import type { ImovelGetDTO } from '@/types/imovel'
import styles from '@/styles/anunciante/MeusAnuncios.module.css'

const MOEDA = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
})

function iniciais(nome?: string): string {
  const partes = nome?.trim().split(/\s+/) ?? []
  if (partes.length === 0) return '?'
  return (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : '')).toUpperCase()
}

export default function MeusAnuncios() {
  const { anunciante, sair } = useAuth()

  const [anuncios, setAnuncios] = useState<ImovelGetDTO[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [excluindo, setExcluindo] = useState<number | null>(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true

    listarMeusAnuncios()
      .then((lista) => {
        if (ativo) setAnuncios(lista)
      })
      .catch(() => {
        if (ativo) setErro('Não foi possível carregar seus anúncios.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [tentativa])

  function tentarNovamente() {
    setCarregando(true)
    setErro(null)
    setTentativa((n) => n + 1)
  }

  async function aoExcluir(anuncio: ImovelGetDTO) {
    const confirmado = window.confirm(
      `Excluir o anúncio "${anuncio.titulo}"? Essa ação não pode ser desfeita.`,
    )
    if (!confirmado) return

    setExcluindo(anuncio.id)

    try {
      await excluirAnuncio(anuncio.id)
      setAnuncios((atuais) => atuais.filter((item) => item.id !== anuncio.id))
    } catch {
      setErro('Não foi possível excluir o anúncio. Tente novamente.')
    } finally {
      setExcluindo(null)
    }
  }

  function aoSair() {
    sair()
    // Navegacao real em vez de navigate(): o redirect da rota protegida venceria a troca de rota
    // do router e jogaria o anunciante na tela de login em vez da home.
    window.location.assign('/')
  }

  return (
    <div className={styles.page}>
      {/* Faixa no azul do header, dando continuidade visual com o resto do app. */}
      <header className={styles.capa}>
        <div className={styles.capaConteudo}>
          <div className={styles.perfil}>
            {anunciante?.fotoUrl ? (
              <img
                src={anunciante.fotoUrl}
                alt=""
                className={styles.avatar}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className={styles.avatarFallback}>{iniciais(anunciante?.nome)}</span>
            )}

            <div>
              <h1 className={styles.titulo}>{anunciante?.nome}</h1>
              <p className={styles.subtitulo}>{anunciante?.email}</p>
            </div>
          </div>

          <div className={styles.capaAcoes}>
            <Link to="/anunciar/novo" className={styles.primario}>
              <Plus className={styles.icone} />
              Novo anúncio
            </Link>
            <button type="button" className={styles.sair} onClick={aoSair}>
              <LogOut className={styles.icone} />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className={styles.conteudo}>
        <ContatoCard />

        <div className={styles.secaoCabecalho}>
          <h2 className={styles.secaoTitulo}>
            Meus anúncios
            {!carregando && anuncios.length > 0 && (
              <span className={styles.contador}>{anuncios.length}</span>
            )}
          </h2>
        </div>

        {erro && (
          <div className={styles.erro}>
            {erro}
            <button type="button" className={styles.linkBtn} onClick={tentarNovamente}>
              Tentar novamente
            </button>
          </div>
        )}

        {carregando ? (
          <ul className={styles.lista}>
            {[0, 1].map((i) => (
              <li key={i} className={styles.esqueleto} aria-hidden="true" />
            ))}
          </ul>
        ) : anuncios.length === 0 ? (
          <div className={styles.vazio}>
            <span className={styles.vazioIcone}>
              <Home className={styles.vazioIconeSvg} />
            </span>
            <p className={styles.vazioTitulo}>Nenhum imóvel publicado ainda</p>
            <p className={styles.vazioTexto}>
              Leva menos de dois minutos: título, preço, bairro e pronto — seu imóvel já aparece
              no mapa para quem procura aluguel em Campina Grande.
            </p>
            <Link to="/anunciar/novo" className={styles.primario}>
              <Plus className={styles.icone} />
              Cadastrar meu primeiro imóvel
            </Link>
          </div>
        ) : (
          <ul className={styles.lista}>
            {anuncios.map((anuncio) => (
              <li key={anuncio.id} className={styles.item}>
                <div className={styles.thumbWrapper}>
                  <img
                    src={anuncio.fotos[0] ?? PLACEHOLDER_IMAGE}
                    alt=""
                    className={styles.thumb}
                    referrerPolicy="no-referrer"
                  />
                  {anuncio.tipoAnuncio && (
                    <span className={styles.selo}>{anuncio.tipoAnuncio}</span>
                  )}
                </div>

                <div className={styles.info}>
                  <p className={styles.preco}>
                    {MOEDA.format(anuncio.preco)}
                    <span className={styles.porMes}>/mês</span>
                  </p>
                  <p className={styles.itemTitulo}>{anuncio.titulo}</p>
                  <p className={styles.local}>
                    {[anuncio.bairro, anuncio.cidade].filter(Boolean).join(', ')}
                  </p>

                  <div className={styles.specs}>
                    {anuncio.quartos != null && (
                      <span className={styles.spec}>
                        <BedDouble className={styles.specIcone} />
                        {anuncio.quartos} {anuncio.quartos === 1 ? 'quarto' : 'quartos'}
                      </span>
                    )}
                    {anuncio.banheiros != null && (
                      <span className={styles.spec}>
                        <Bath className={styles.specIcone} />
                        {anuncio.banheiros}
                      </span>
                    )}
                    {anuncio.areaM2 != null && (
                      <span className={styles.spec}>
                        <Ruler className={styles.specIcone} />
                        {anuncio.areaM2} m²
                      </span>
                    )}
                    {anuncio.fotos.length === 0 && (
                      <span className={styles.avisoSemFoto}>sem foto</span>
                    )}
                  </div>
                </div>

                <div className={styles.itemAcoes}>
                  <Link to={`/anunciar/${anuncio.id}/editar`} className={styles.acaoBtn}>
                    <Pencil className={styles.icone} />
                    Editar
                  </Link>
                  <button
                    type="button"
                    className={styles.acaoPerigo}
                    disabled={excluindo === anuncio.id}
                    onClick={() => aoExcluir(anuncio)}
                  >
                    <Trash2 className={styles.icone} />
                    {excluindo === anuncio.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
