import { useState, type FormEvent } from 'react'
import { Check, Phone, Pencil, TriangleAlert } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { formatarTelefone, normalizarTelefone } from '@/lib/contato'
import styles from '@/styles/anunciante/ContatoCard.module.css'

/**
 * Sem telefone o botao "Falar com o anunciante" nos anuncios fica inativo, entao o painel
 * cobra esse dado logo de cara.
 */
export default function ContatoCard() {
  const { anunciante, atualizarTelefone } = useAuth()

  const [editando, setEditando] = useState(false)
  const [valor, setValor] = useState(anunciante?.telefone ?? '')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const telefone = formatarTelefone(anunciante?.telefone)

  async function aoEnviar(evento: FormEvent) {
    evento.preventDefault()

    if (normalizarTelefone(valor) == null) {
      setErro('Informe um número com DDD, por exemplo (83) 99999-0000.')
      return
    }

    setSalvando(true)
    setErro(null)

    try {
      await atualizarTelefone(valor)
      setEditando(false)
    } catch {
      setErro('Não foi possível salvar o telefone. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  if (editando) {
    return (
      <form className={styles.card} onSubmit={aoEnviar}>
        <label className={styles.campo}>
          <span className={styles.rotulo}>Telefone para contato</span>
          <input
            className={styles.input}
            autoFocus
            inputMode="tel"
            placeholder="(83) 99999-0000"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </label>

        {erro && <p className={styles.erro}>{erro}</p>}

        <div className={styles.acoes}>
          <button
            type="button"
            className={styles.cancelar}
            onClick={() => {
              setEditando(false)
              setErro(null)
              setValor(anunciante?.telefone ?? '')
            }}
          >
            Cancelar
          </button>
          <button type="submit" className={styles.salvar} disabled={salvando}>
            <Check className={styles.icone} />
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    )
  }

  return (
    <div className={telefone ? styles.card : styles.cardAlerta}>
      <span className={telefone ? styles.selo : styles.seloAlerta}>
        {telefone ? <Phone className={styles.icone} /> : <TriangleAlert className={styles.icone} />}
      </span>

      <div className={styles.texto}>
        <p className={styles.titulo}>
          {telefone ? `Interessados falam com você no ${telefone}` : 'Falta seu telefone'}
        </p>
        <p className={styles.descricao}>
          {telefone
            ? 'É esse número que aparece no botão de contato dos seus anúncios.'
            : 'Sem um número, o botão de contato dos seus anúncios fica desativado e ninguém consegue falar com você.'}
        </p>
      </div>

      <button type="button" className={styles.editar} onClick={() => setEditando(true)}>
        <Pencil className={styles.icone} />
        {telefone ? 'Alterar' : 'Adicionar'}
      </button>
    </div>
  )
}
