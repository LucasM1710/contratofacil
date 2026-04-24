'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Tipo = 'servico' | 'locacao'
type Plano = 'free' | 'pro'

interface UserData {
  plano: Plano
  contratos_mes: number
  email: string
}

interface ServicoForm {
  contratante: string
  cpf_contratante: string
  prestador: string
  cpf_prestador: string
  servico: string
  valor: string
  pagamento: string
  prazo: string
  cidade: string
}

interface LocacaoForm {
  locador: string
  cpf_locador: string
  locatario: string
  cpf_locatario: string
  endereco: string
  tipo_imovel: string
  valor: string
  vencimento: string
  duracao: string
  indice: string
  garantia: string
}

export default function Dashboard() {
  const router = useRouter()
  const [tipo, setTipo] = useState<Tipo>('servico')
  const [userData, setUserData] = useState<UserData>({ plano: 'free', contratos_mes: 0, email: '' })
  const [loading, setLoading] = useState(false)
  const [loadingUser, setLoadingUser] = useState(true)
  const [contrato, setContrato] = useState('')
  const [erro, setErro] = useState('')
  const [copiado, setCopiado] = useState(false)
  const [clausulasExtras, setClausulasExtras] = useState('')

  const [servico, setServico] = useState<ServicoForm>({
    contratante: '', cpf_contratante: '', prestador: '', cpf_prestador: '',
    servico: '', valor: '', pagamento: '50% no início e 50% na entrega', prazo: '', cidade: ''
  })

  const [locacao, setLocacao] = useState<LocacaoForm>({
    locador: '', cpf_locador: '', locatario: '', cpf_locatario: '',
    endereco: '', tipo_imovel: 'residencial', valor: '', vencimento: '',
    duracao: '12 meses', indice: 'IGPM', garantia: 'caução de 3 meses de aluguel'
  })

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single()
      if (data) {
        setUserData({
          plano: data.plano,
          contratos_mes: data.contratos_mes,
          email: session.user.email || ''
        })
      }
      setLoadingUser(false)
    }
    loadUser()
  }, [router])

  async function sair() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function gerar() {
    if (userData.plano === 'free' && userData.contratos_mes >= 3) {
      setErro('Limite do plano Free atingido. Assine o Pro para contratos ilimitados.')
      return
    }
    setLoading(true)
    setErro('')
    setContrato('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const dados = tipo === 'servico'
        ? { ...servico, clausulas_extras: userData.plano === 'pro' ? clausulasExtras : '' }
        : locacao
      const res = await fetch('/api/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          dados,
          userId: session?.user.id,
          email: session?.user.email
        })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setContrato(data.contrato)
      if (session) {
        const novoTotal = userData.contratos_mes + 1
        await supabase.from('users').update({ contratos_mes: novoTotal }).eq('id', session.user.id)
        setUserData(prev => ({ ...prev, contratos_mes: novoTotal }))
      }
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao gerar contrato')
    } finally {
      setLoading(false)
    }
  }

  async function copiar() {
    await navigator.clipboard.writeText(contrato)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  async function baixarDocx() {
    if (userData.plano !== 'pro') { setErro('Download DOCX é exclusivo do plano Pro.'); return }
    const { Document, Paragraph, TextRun, Packer } = await import('docx')
    const { saveAs } = await import('file-saver')
    const linhas = contrato.split('\n')
    const doc = new Document({
      sections: [{
        properties: {},
        children: linhas.map(linha => new Paragraph({
          children: [new TextRun({ text: linha, size: 24, font: 'Times New Roman' })],
          spacing: { after: 120 }
        }))
      }]
    })
    const blob = await Packer.toBlob(doc)
    saveAs(blob, `contrato_${tipo}_${Date.now()}.docx`)
  }

  async function assinarPro() {
    setErro('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, email: session.user.email })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else throw new Error('Erro ao redirecionar para o pagamento')
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao iniciar pagamento')
    }
  }

  async function gerenciarAssinatura() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (e) {
      console.error(e)
    }
  }

  const inp: React.CSSProperties = {
    fontFamily: 'inherit', fontSize: 14, padding: '11px 13px',
    border: '1.5px solid #E5E5E5', borderRadius: 8, background: '#fff',
    color: '#111', width: '100%', boxSizing: 'border-box', outline: 'none'
  }
  const lbl: React.CSSProperties = {
    fontSize: 11, fontWeight: 500, color: '#999',
    textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 6
  }

  const isPro = userData.plano === 'pro'
  const restantes = Math.max(0, 3 - userData.contratos_mes)

  if (loadingUser) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F7F7', fontFamily: 'system-ui' }}>
      <div style={{ color: '#AAA', fontSize: 14 }}>Carregando...</div>
    </div>
  )

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', background: '#F7F7F7', minHeight: '100vh', paddingBottom: 80 }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #EBEBEB', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill="#111"/>
            <rect x="9" y="9" width="7" height="9" rx="1.5" fill="white"/>
            <rect x="20" y="9" width="7" height="9" rx="1.5" fill="white"/>
            <rect x="9" y="21" width="7" height="6" rx="1.5" fill="white"/>
            <rect x="20" y="21" width="3" height="6" rx="1.5" fill="white"/>
            <rect x="24" y="21" width="3" height="6" rx="1.5" fill="white"/>
          </svg>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Contrato Fácil</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {!isPro && (
            <span style={{ fontSize: 12, color: '#888' }}>
              {restantes} contrato{restantes !== 1 ? 's' : ''} restante{restantes !== 1 ? 's' : ''}
            </span>
          )}
          <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: isPro ? '#111' : '#F2F2F2', color: isPro ? '#fff' : '#666', fontWeight: 600, letterSpacing: '.3px' }}>
            {isPro ? 'PRO ✦' : 'FREE'}
          </span>
          {isPro && (
            <button onClick={gerenciarAssinatura} style={{ background: 'transparent', color: '#888', border: '1px solid #E5E5E5', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
              Gerenciar assinatura
            </button>
          )}
          <span style={{ fontSize: 13, color: '#AAA' }}>{userData.email}</span>
          <button onClick={sair} style={{ background: 'transparent', color: '#AAA', border: '1px solid #E5E5E5', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
            Sair
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 24px' }}>

        {/* Título */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111', marginBottom: 6, letterSpacing: '-0.5px' }}>Gerar contrato</h1>
          <p style={{ color: '#888', fontSize: 14 }}>Preencha os dados — a IA gera o contrato completo</p>
        </div>

        {/* Aviso jurídico */}
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '11px 15px', marginBottom: 28, fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
          ⚠ Contratos gerados por IA têm caráter informativo. Para situações complexas ou de alto valor, recomendamos revisão por advogado.
        </div>

        {/* Banner upgrade */}
        {!isPro && restantes === 0 && (
          <div style={{ background: '#111', borderRadius: 12, padding: '20px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Limite atingido</div>
              <div style={{ color: '#888', fontSize: 13 }}>Assine o Pro por R$39,99/mês para contratos ilimitados</div>
            </div>
            <button onClick={assinarPro} style={{ background: '#fff', color: '#111', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap' }}>
              Assinar Pro — R$39,99/mês
            </button>
          </div>
        )}

        {/* Tipo de contrato */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {(['servico', 'locacao'] as Tipo[]).map((t) => {
            const icon = t === 'servico' ? '💼' : '🏠'
            const title = t === 'servico' ? 'Prestação de serviço' : 'Locação de imóvel'
            const desc = t === 'servico' ? 'Freelancers, consultores, PJs' : 'Aluguel residencial ou comercial'
            return (
              <div key={t} onClick={() => setTipo(t)} style={{ background: tipo === t ? '#111' : '#fff', color: tipo === t ? '#fff' : '#111', border: `1.5px solid ${tipo === t ? '#111' : '#E5E5E5'}`, borderRadius: 12, padding: '18px 20px', cursor: 'pointer', transition: 'all .15s' }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{title}</div>
                <div style={{ fontSize: 12, color: tipo === t ? '#888' : '#AAA' }}>{desc}</div>
              </div>
            )
          })}
        </div>

        {/* Form Serviço */}
        {tipo === 'servico' && (
          <div style={{ background: '#fff', border: '1.5px solid #E5E5E5', borderRadius: 12, padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={lbl}>Contratante (quem paga)</label>
                <input style={inp} placeholder="Ex: Maria Silva" value={servico.contratante} onChange={e => setServico({ ...servico, contratante: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>CPF / CNPJ do contratante</label>
                <input style={inp} placeholder="000.000.000-00" value={servico.cpf_contratante} onChange={e => setServico({ ...servico, cpf_contratante: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Prestador (quem executa)</label>
                <input style={inp} placeholder="Ex: João Dev" value={servico.prestador} onChange={e => setServico({ ...servico, prestador: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>CPF / CNPJ do prestador</label>
                <input style={inp} placeholder="000.000.000-00" value={servico.cpf_prestador} onChange={e => setServico({ ...servico, cpf_prestador: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Descrição do serviço</label>
                <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} placeholder="Ex: Desenvolvimento de site WordPress com 10 páginas, SEO básico e 2h de treinamento." value={servico.servico} onChange={e => setServico({ ...servico, servico: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Valor (R$)</label>
                <input style={inp} placeholder="3.500,00" value={servico.valor} onChange={e => setServico({ ...servico, valor: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Forma de pagamento</label>
                <select style={inp} value={servico.pagamento} onChange={e => setServico({ ...servico, pagamento: e.target.value })}>
                  <option value="50% no início e 50% na entrega">50% início + 50% entrega</option>
                  <option value="pagamento único na entrega">À vista na entrega</option>
                  <option value="pagamento mensal">Mensal</option>
                  <option value="3 parcelas iguais">3 parcelas iguais</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Prazo de entrega</label>
                <input style={inp} placeholder="Ex: 30 dias corridos" value={servico.prazo} onChange={e => setServico({ ...servico, prazo: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Cidade</label>
                <input style={inp} placeholder="Ex: São Paulo, SP" value={servico.cidade} onChange={e => setServico({ ...servico, cidade: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ ...lbl, display: 'flex', alignItems: 'center', gap: 8 }}>
                  Cláusulas extras
                  {!isPro && (
                    <span style={{ background: '#111', color: '#fff', fontSize: 9, padding: '2px 7px', borderRadius: 4, fontWeight: 600, letterSpacing: '.5px' }}>PRO</span>
                  )}
                </label>
                <textarea
                  style={{ ...inp, minHeight: 70, resize: 'vertical', opacity: isPro ? 1 : 0.4, cursor: isPro ? 'text' : 'not-allowed' }}
                  placeholder={isPro ? 'Ex: Cláusula de sigilo por 2 anos. Multa de 20% por rescisão antecipada.' : 'Disponível no plano Pro'}
                  disabled={!isPro}
                  value={clausulasExtras}
                  onChange={e => setClausulasExtras(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Form Locação */}
        {tipo === 'locacao' && (
          <div style={{ background: '#fff', border: '1.5px solid #E5E5E5', borderRadius: 12, padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={lbl}>Locador (proprietário)</label>
                <input style={inp} placeholder="Ex: Carlos Santos" value={locacao.locador} onChange={e => setLocacao({ ...locacao, locador: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>CPF / CNPJ do locador</label>
                <input style={inp} placeholder="000.000.000-00" value={locacao.cpf_locador} onChange={e => setLocacao({ ...locacao, cpf_locador: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Locatário (inquilino)</label>
                <input style={inp} placeholder="Ex: Ana Lima" value={locacao.locatario} onChange={e => setLocacao({ ...locacao, locatario: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>CPF do locatário</label>
                <input style={inp} placeholder="000.000.000-00" value={locacao.cpf_locatario} onChange={e => setLocacao({ ...locacao, cpf_locatario: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Endereço do imóvel</label>
                <input style={inp} placeholder="Ex: Rua das Flores, 123, Apto 45, Pinheiros, SP" value={locacao.endereco} onChange={e => setLocacao({ ...locacao, endereco: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Tipo de imóvel</label>
                <select style={inp} value={locacao.tipo_imovel} onChange={e => setLocacao({ ...locacao, tipo_imovel: e.target.value })}>
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Valor do aluguel (R$)</label>
                <input style={inp} placeholder="2.500,00" value={locacao.valor} onChange={e => setLocacao({ ...locacao, valor: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Vencimento</label>
                <input style={inp} placeholder="Ex: dia 5 de cada mês" value={locacao.vencimento} onChange={e => setLocacao({ ...locacao, vencimento: e.target.value })} />
              </div>
              <div>
                <label style={lbl}>Duração</label>
                <select style={inp} value={locacao.duracao} onChange={e => setLocacao({ ...locacao, duracao: e.target.value })}>
                  <option value="12 meses">12 meses</option>
                  <option value="24 meses">24 meses</option>
                  <option value="30 meses">30 meses</option>
                  <option value="indeterminado">Indeterminado</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Índice de reajuste</label>
                <select style={inp} value={locacao.indice} onChange={e => setLocacao({ ...locacao, indice: e.target.value })}>
                  <option value="IGPM">IGPM</option>
                  <option value="IPCA">IPCA</option>
                  <option value="INPC">INPC</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Garantia</label>
                <select style={inp} value={locacao.garantia} onChange={e => setLocacao({ ...locacao, garantia: e.target.value })}>
                  <option value="caução de 3 meses de aluguel">Caução (3 meses)</option>
                  <option value="fiador">Fiador</option>
                  <option value="seguro fiança">Seguro fiança</option>
                  <option value="sem garantia">Sem garantia</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Botão gerar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
          <button
            onClick={gerar}
            disabled={loading || (!isPro && restantes === 0)}
            style={{
              background: loading || (!isPro && restantes === 0) ? '#CCC' : '#111',
              color: '#fff', border: 'none', padding: '13px 32px', borderRadius: 10,
              fontSize: 15, fontWeight: 500,
              cursor: loading || (!isPro && restantes === 0) ? 'not-allowed' : 'pointer',
              letterSpacing: '-.2px'
            }}
          >
            {loading ? 'Gerando...' : 'Gerar com IA →'}
          </button>
        </div>

        {/* Erro */}
        {erro && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '12px 16px', color: '#991B1B', fontSize: 13, marginBottom: 24 }}>
            ⚠ {erro}
          </div>
        )}

        {/* Resultado */}
        {contrato && (
          <div style={{ background: '#fff', border: '1.5px solid #E5E5E5', borderRadius: 12, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F0F0F0', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>✓ Contrato gerado</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={copiar}
                  style={{ background: copiado ? '#F0FDF4' : '#F5F5F5', color: copiado ? '#166534' : '#111', border: `1px solid ${copiado ? '#BBF7D0' : '#E5E5E5'}`, padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all .2s' }}
                >
                  {copiado ? '✓ Copiado' : 'Copiar'}
                </button>
                <button
                  onClick={baixarDocx}
                  style={{ background: isPro ? '#111' : '#F5F5F5', color: isPro ? '#fff' : '#AAA', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: isPro ? 'pointer' : 'not-allowed', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  ↓ DOCX {!isPro && <span style={{ fontSize: 9, background: '#DDD', padding: '1px 5px', borderRadius: 3, fontWeight: 700 }}>PRO</span>}
                </button>
              </div>
            </div>
            <pre style={{ fontFamily: 'Georgia, serif', fontSize: 13, lineHeight: 1.95, whiteSpace: 'pre-wrap', color: '#222', margin: 0 }}>
              {contrato}
            </pre>
          </div>
        )}
      </div>
    </main>
  )
}
