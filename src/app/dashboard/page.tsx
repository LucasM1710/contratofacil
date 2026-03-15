'use client'
import { useState } from 'react'

type Tipo = 'servico' | 'locacao'
type Plano = 'free' | 'pro'

export default function Dashboard() {
  const [tipo, setTipo] = useState<Tipo>('servico')
  const [plano] = useState<Plano>('free')
  const [loading, setLoading] = useState(false)
  const [contrato, setContrato] = useState('')
  const [erro, setErro] = useState('')

  const [servico, setServico] = useState({ contratante: '', cpf_contratante: '', prestador: '', cpf_prestador: '', servico: '', valor: '', pagamento: '50% no início e 50% na entrega', prazo: '', cidade: '' })
  const [locacao, setLocacao] = useState({ locador: '', cpf_locador: '', locatario: '', cpf_locatario: '', endereco: '', tipo_imovel: 'residencial', valor: '', vencimento: '', duracao: '12 meses', indice: 'IGPM', garantia: 'caução de 3 meses de aluguel' })

  async function gerar() {
    setLoading(true)
    setErro('')
    setContrato('')
    try {
      const dados = tipo === 'servico' ? servico : locacao
      const res = await fetch('/api/gerar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, dados })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setContrato(data.contrato)
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao gerar contrato')
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = { fontFamily: 'inherit', fontSize: 14, padding: '10px 12px', border: '1.5px solid #E0E0E0', borderRadius: 8, background: '#FFFFFF', color: '#111111', width: '100%', boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 500, color: '#AAA', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 6 }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', background: '#FAFAFA', minHeight: '100vh', padding: '0 0 80px' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #E0E0E0', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="36" height="36" rx="8" fill="#111"/>
            <rect x="9" y="9" width="7" height="9" rx="1.5" fill="white"/>
            <rect x="20" y="9" width="7" height="9" rx="1.5" fill="white"/>
            <rect x="9" y="21" width="7" height="6" rx="1.5" fill="white"/>
            <rect x="20" y="21" width="3" height="6" rx="1.5" fill="white"/>
            <rect x="24" y="21" width="3" height="6" rx="1.5" fill="white"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#111', letterSpacing: '.3px' }}>Contrato Fácil</span>
        </div>
        <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 4, background: plano === 'pro' ? '#111' : '#F2F2F2', color: plano === 'pro' ? '#fff' : '#555', border: '1px solid #DDD', fontWeight: 500 }}>
            {plano === 'pro' ? 'Pro ✦' : 'Free'}
        </span>
    </header>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 24px' }}>
        <h1 style={{ color: '#666', fontSize: 24, fontWeight: 600, marginBottom: 6 }}>Gerar contrato</h1>
        <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>Preencha os dados — a IA gera o contrato completo</p>
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '12px 16px', marginBottom: 28, fontSize: 13, color: '#92400E', lineHeight: 1.6 }}>
        ⚠ Os contratos gerados por IA têm caráter informativo e de auxílio à redação. Para situações de maior complexidade ou valor elevado, recomendamos revisão por um advogado. O Contrato Fácil não se responsabiliza pelo uso dos documentos gerados.
        </div>

        {/* Tipo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
          {([['servico', '💼', 'Prestação de serviço', 'Freelancers, consultores, PJs'], ['locacao', '🏠', 'Locação de imóvel', 'Aluguel residencial ou comercial']] as const).map(([t, icon, title, desc]) => (
            <div key={t} onClick={() => setTipo(t)} style={{ background: tipo === t ? '#111' : '#fff', color: tipo === t ? '#fff' : '#111', border: `1.5px solid ${tipo === t ? '#111' : '#E0E0E0'}`, borderRadius: 12, padding: 20, cursor: 'pointer' }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: tipo === t ? '#AAA' : '#888' }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Form Serviço */}
        {tipo === 'servico' && (
          <div style={{ background: '#fff', border: '1.5px solid #E0E0E0', borderRadius: 12, padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[['Contratante (quem paga)', 'contratante', 'Ex: Maria Silva'], ['CPF / CNPJ do contratante', 'cpf_contratante', '000.000.000-00'], ['Prestador (quem executa)', 'prestador', 'Ex: João Dev'], ['CPF / CNPJ do prestador', 'cpf_prestador', '000.000.000-00']].map(([label, field, placeholder]) => (
                <div key={field}>
                  <label style={lbl}>{label}</label>
                  <input style={inp} placeholder={placeholder} value={servico[field as keyof typeof servico]} onChange={e => setServico({ ...servico, [field]: e.target.value })} />
                </div>
              ))}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Descrição do serviço</label>
                <textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} placeholder="Ex: Desenvolvimento de site WordPress com 10 páginas..." value={servico.servico} onChange={e => setServico({ ...servico, servico: e.target.value })} />
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
            </div>
          </div>
        )}

        {/* Form Locação */}
        {tipo === 'locacao' && (
          <div style={{ background: '#fff', border: '1.5px solid #E0E0E0', borderRadius: 12, padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[['Locador (proprietário)', 'locador', 'Ex: Carlos Santos'], ['CPF / CNPJ do locador', 'cpf_locador', '000.000.000-00'], ['Locatário (inquilino)', 'locatario', 'Ex: Ana Lima'], ['CPF do locatário', 'cpf_locatario', '000.000.000-00']].map(([label, field, placeholder]) => (
                <div key={field}>
                  <label style={lbl}>{label}</label>
                  <input style={inp} placeholder={placeholder} value={locacao[field as keyof typeof locacao]} onChange={e => setLocacao({ ...locacao, [field]: e.target.value })} />
                </div>
              ))}
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Endereço do imóvel</label>
                <input style={inp} placeholder="Ex: Rua das Flores, 123, Apto 45, SP" value={locacao.endereco} onChange={e => setLocacao({ ...locacao, endereco: e.target.value })} />
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
                  <option>12 meses</option><option>24 meses</option><option>30 meses</option><option value="indeterminado">Indeterminado</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Índice de reajuste</label>
                <select style={inp} value={locacao.indice} onChange={e => setLocacao({ ...locacao, indice: e.target.value })}>
                  <option>IGPM</option><option>IPCA</option><option>INPC</option>
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
          <button onClick={gerar} disabled={loading} style={{ background: loading ? '#999' : '#111', color: '#fff', border: 'none', padding: '13px 28px', borderRadius: 8, fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer' }}>
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
          <div style={{ background: '#fff', border: '1.5px solid #E0E0E0', borderRadius: 12, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #E0E0E0' }}>
              <div style={{ fontSize: 17, fontWeight: 600 }}>Contrato gerado</div>
              <button onClick={() => navigator.clipboard.writeText(contrato)} style={{ background: '#111', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                Copiar
              </button>
            </div>
            <pre style={{ fontFamily: 'Georgia, serif', fontSize: 13, lineHeight: 1.9, whiteSpace: 'pre-wrap', color: '#111' }}>{contrato}</pre>
          </div>
        )}
      </div>
    </main>
  )
}