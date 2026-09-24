import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { CAMPINA_GRANDE_NEIGHBORHOODS } from '@/data/neighborhoods'
import { normalizarUrlImagem } from '@/lib/imagemUrl'
import { resolveCoordinates } from '@/lib/neighborhoodCoords'
import { atualizarAnuncio, criarAnuncio, getMeuAnuncio } from '@/services/anuncios'
import type { AnuncioPayload } from '@/types/anuncio'
import styles from '@/styles/anunciante/AnuncioForm.module.css'

const CATEGORIAS = [
  { valor: 'casa', rotulo: 'Casa' },
  { valor: 'apartamento', rotulo: 'Apartamento' },
  { valor: 'kitnet', rotulo: 'Kitnet' },
]

const TIPOS_ANUNCIO = [
  { valor: 'aluguel', rotulo: 'Aluguel' },
  { valor: 'venda', rotulo: 'Venda' },
]

interface FormState {
  titulo: string
  preco: string
  tipoAnuncio: string
  categoria: string
  bairro: string
  endereco: string
  cidade: string
  quartos: string
  banheiros: string
  areaM2: string
  vagas: string
  condominio: string
  iptu: string
  descricao: string
}

const ESTADO_INICIAL: FormState = {
  titulo: '',
  preco: '',
  tipoAnuncio: 'aluguel',
  categoria: 'apartamento',
  bairro: '',
  endereco: '',
  cidade: 'Campina Grande',
  quartos: '',
  banheiros: '',
  areaM2: '',
  vagas: '',
  condominio: '',
  iptu: '',
  descricao: '',
}

/** Campo numerico vazio vira null, para nao mandar 0 quando o anunciante nao soube informar. */
function numeroOuNulo(valor: string): number | null {
  const limpo = valor.trim()
  if (!limpo) return null

  const numero = Number(limpo.replace(',', '.'))
  return Number.isFinite(numero) ? numero : null
}

export default function AnuncioForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const editando = id != null

  const [form, setForm] = useState<FormState>(ESTADO_INICIAL)
  const [fotos, setFotos] = useState<string[]>([])
  const [novaFoto, setNovaFoto] = useState('')
  const [fotosQuebradas, setFotosQuebradas] = useState<string[]>([])
  const [carregando, setCarregando] = useState(editando)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    if (!editando) return

    let ativo = true

    getMeuAnuncio(Number(id))
      .then((anuncio) => {
        if (!ativo) return

        setForm({
          titulo: anuncio.titulo ?? '',
          preco: anuncio.preco != null ? String(anuncio.preco) : '',
          tipoAnuncio: anuncio.tipoAnuncio ?? 'aluguel',
          categoria: anuncio.categoria ?? 'apartamento',
          bairro: anuncio.bairro ?? '',
          endereco: anuncio.endereco ?? '',
          cidade: anuncio.cidade ?? 'Campina Grande',
          quartos: anuncio.quartos != null ? String(anuncio.quartos) : '',
          banheiros: anuncio.banheiros != null ? String(anuncio.banheiros) : '',
          areaM2: anuncio.areaM2 != null ? String(anuncio.areaM2) : '',
          vagas: anuncio.vagas != null ? String(anuncio.vagas) : '',
          condominio: anuncio.condominio != null ? String(anuncio.condominio) : '',
          iptu: anuncio.iptu != null ? String(anuncio.iptu) : '',
          descricao: anuncio.descricao ?? '',
        })
        setFotos(anuncio.fotos ?? [])
      })
      .catch(() => {
        if (ativo) setErro('Não foi possível carregar esse anúncio.')
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [editando, id])

  function set<K extends keyof FormState>(campo: K, valor: FormState[K]) {
    setForm((atual) => ({ ...atual, [campo]: valor }))
  }

  function adicionarFoto() {
    // Link do Drive vira o endereco direto da imagem; o resto passa como veio.
    const url = normalizarUrlImagem(novaFoto)
    if (!url) return

    setFotos((atuais) => (atuais.includes(url) ? atuais : [...atuais, url]))
    setNovaFoto('')
  }

  function removerFoto(indice: number) {
    setFotos((atuais) => atuais.filter((_, i) => i !== indice))
  }

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault()

    const preco = numeroOuNulo(form.preco)
    if (preco == null || preco <= 0) {
      setErro('Informe um preço válido.')
      return
    }

    setSalvando(true)
    setErro(null)

    // Sem lat/lng o imovel nao aparece no mapa, entao usamos o ponto central do bairro.
    const coordenadas = await resolveCoordinates(form.bairro)

    const payload: AnuncioPayload = {
      titulo: form.titulo.trim(),
      preco,
      endereco: form.endereco.trim(),
      bairro: form.bairro.trim(),
      cidade: form.cidade.trim(),
      estado: 'PB',
      tipoAnuncio: form.tipoAnuncio,
      categoria: form.categoria,
      latitude: coordenadas.lat,
      longitude: coordenadas.lng,
      quartos: numeroOuNulo(form.quartos),
      banheiros: numeroOuNulo(form.banheiros),
      areaM2: numeroOuNulo(form.areaM2),
      vagas: numeroOuNulo(form.vagas),
      condominio: numeroOuNulo(form.condominio),
      iptu: numeroOuNulo(form.iptu),
      descricao: form.descricao.trim() || null,
      fotos,
    }

    try {
      if (editando) await atualizarAnuncio(Number(id), payload)
      else await criarAnuncio(payload)

      navigate('/anunciar')
    } catch {
      setErro('Não foi possível salvar o anúncio. Confira os campos e tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return <p className={styles.estado}>Carregando anúncio...</p>
  }

  return (
    <main className={styles.page}>
      <Link to="/anunciar" className={styles.voltar}>
        <ArrowLeft className={styles.iconeBotao} />
        Voltar para meus anúncios
      </Link>

      <h1 className={styles.title}>{editando ? 'Editar anúncio' : 'Novo anúncio'}</h1>

      <form className={styles.form} onSubmit={aoEnviar}>
        <label className={styles.campoLargo}>
          <span className={styles.rotulo}>Título</span>
          <input
            className={styles.input}
            required
            maxLength={255}
            placeholder="Apartamento mobiliado a 5 min da UFCG"
            value={form.titulo}
            onChange={(e) => set('titulo', e.target.value)}
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.rotulo}>Tipo de anúncio</span>
          <select
            className={styles.input}
            value={form.tipoAnuncio}
            onChange={(e) => set('tipoAnuncio', e.target.value)}
          >
            {TIPOS_ANUNCIO.map((t) => (
              <option key={t.valor} value={t.valor}>{t.rotulo}</option>
            ))}
          </select>
        </label>

        <label className={styles.campo}>
          <span className={styles.rotulo}>Tipo de imóvel</span>
          <select
            className={styles.input}
            value={form.categoria}
            onChange={(e) => set('categoria', e.target.value)}
          >
            {CATEGORIAS.map((c) => (
              <option key={c.valor} value={c.valor}>{c.rotulo}</option>
            ))}
          </select>
        </label>

        <label className={styles.campo}>
          <span className={styles.rotulo}>Preço mensal (R$)</span>
          <input
            className={styles.input}
            required
            inputMode="decimal"
            placeholder="850"
            value={form.preco}
            onChange={(e) => set('preco', e.target.value)}
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.rotulo}>Bairro</span>
          <select
            className={styles.input}
            required
            value={form.bairro}
            onChange={(e) => set('bairro', e.target.value)}
          >
            <option value="">Selecione o bairro</option>
            {CAMPINA_GRANDE_NEIGHBORHOODS.map((bairro) => (
              <option key={bairro} value={bairro}>{bairro}</option>
            ))}
          </select>
        </label>

        <label className={styles.campoLargo}>
          <span className={styles.rotulo}>Endereço</span>
          <input
            className={styles.input}
            required
            maxLength={255}
            placeholder="Rua Aprígio Veloso, 882"
            value={form.endereco}
            onChange={(e) => set('endereco', e.target.value)}
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.rotulo}>Quartos</span>
          <input
            className={styles.input}
            type="number"
            min={0}
            value={form.quartos}
            onChange={(e) => set('quartos', e.target.value)}
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.rotulo}>Banheiros</span>
          <input
            className={styles.input}
            type="number"
            min={0}
            value={form.banheiros}
            onChange={(e) => set('banheiros', e.target.value)}
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.rotulo}>Área (m²)</span>
          <input
            className={styles.input}
            inputMode="decimal"
            value={form.areaM2}
            onChange={(e) => set('areaM2', e.target.value)}
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.rotulo}>Vagas de garagem</span>
          <input
            className={styles.input}
            type="number"
            min={0}
            value={form.vagas}
            onChange={(e) => set('vagas', e.target.value)}
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.rotulo}>Condomínio (R$)</span>
          <input
            className={styles.input}
            inputMode="decimal"
            value={form.condominio}
            onChange={(e) => set('condominio', e.target.value)}
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.rotulo}>IPTU (R$)</span>
          <input
            className={styles.input}
            inputMode="decimal"
            value={form.iptu}
            onChange={(e) => set('iptu', e.target.value)}
          />
        </label>

        <label className={styles.campoLargo}>
          <span className={styles.rotulo}>Descrição</span>
          <textarea
            className={styles.textarea}
            rows={5}
            placeholder="Conte o que o anúncio tem de diferente: mobília, contas inclusas, regras, distância do campus..."
            value={form.descricao}
            onChange={(e) => set('descricao', e.target.value)}
          />
        </label>

        <div className={styles.campoLargo}>
          <span className={styles.rotulo}>Fotos (link da imagem)</span>
          <p className={styles.ajuda}>
            Cole o link de uma imagem ou o link de compartilhamento do Google Drive. No Drive, o
            arquivo precisa estar como <strong>“Qualquer pessoa com o link”</strong>, senão a foto
            não aparece para quem visita o site.
          </p>

          <div className={styles.fotoEntrada}>
            <input
              className={styles.input}
              placeholder="https://..."
              value={novaFoto}
              onChange={(e) => setNovaFoto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  adicionarFoto()
                }
              }}
            />
            <button type="button" className={styles.addFoto} onClick={adicionarFoto}>
              <Plus className={styles.iconeBotao} />
              Adicionar
            </button>
          </div>

          {fotos.length > 0 && (
            <ul className={styles.galeria}>
              {fotos.map((url, indice) => (
                <li key={`${url}-${indice}`} className={styles.fotoItem}>
                  {fotosQuebradas.includes(url) ? (
                    <span className={styles.fotoQuebrada}>
                      Não carregou. Confira se o link é público.
                    </span>
                  ) : (
                    <img
                      src={url}
                      alt={`Foto ${indice + 1}`}
                      className={styles.fotoPreview}
                      onError={() =>
                        setFotosQuebradas((atuais) =>
                          atuais.includes(url) ? atuais : [...atuais, url],
                        )
                      }
                    />
                  )}
                  <button
                    type="button"
                    className={styles.removerFoto}
                    aria-label={`Remover foto ${indice + 1}`}
                    onClick={() => removerFoto(indice)}
                  >
                    <X className={styles.iconeBotao} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {erro && <p className={styles.erro}>{erro}</p>}

        <div className={styles.acoes}>
          <Link to="/anunciar" className={styles.cancelar}>Cancelar</Link>
          <button type="submit" className={styles.salvar} disabled={salvando}>
            {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Publicar anúncio'}
          </button>
        </div>
      </form>
    </main>
  )
}
