'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const Feature = ({ ok, text }: { ok: boolean; text: string }) => (
    <li style={{ padding: '4px 0', display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: ok ? '#444' : '#BBB' }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: ok ? '#111' : '#CCC', flexShrink: 0 }}>{ok ? '✓' : '–'}</span>
      {text}
    </li>
  )

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', background: '#F7F7F7', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #EBEBEB', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill="#111"/>
            <rect x="9" y="9" width="7" height="9" rx="1.5" fill="white"/>
            <rect x="20" y="9" width="7" height="9" rx="1.5" fill="white"/>
            <rect x="9" y="21" width="7" height="6" rx="1.5" fill="white"/>
            <rect x="20" y="21" width="3" height="6" rx="1.5" fill="white"/>
            <rect x="24" y="21" width="3" height="6" rx="1.5" fill="white"/>
          </svg>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Contrato Fácil</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => router.push('/login')} style={{ background: 'transparent', color: '#555', border: '1.5px solid #E0E0E0', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
            Entrar
          </button>
          <button onClick={() => router.push('/login')} style={{ background: '#111', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
            Começar grátis
          </button>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '96px 24px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: '#F0F0F0', borderRadius: 20, padding: '5px 14px', fontSize: 12, color: '#666', fontWeight: 500, letterSpacing: '.5px', marginBottom: 24 }}>
          Powered by Claude AI
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1, marginBottom: 20, color: '#111', letterSpacing: '-1px' }}>
          Contratos jurídicos<br />em <span style={{ color: '#555', fontStyle: 'italic', fontWeight: 400 }}>segundos</span>
        </h1>
        <p style={{ fontSize: 18, color: '#666', marginBottom: 40, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 40px' }}>
          Prestação de serviço e locação de imóvel.<br />Gerado com IA, válido no Brasil.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/login')} style={{ background: '#111', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 500, letterSpacing: '-.2px' }}>
            Gerar contrato grátis
          </button>
          <button onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ background: '#fff', color: '#111', border: '1.5px solid #E0E0E0', padding: '14px 32px', borderRadius: 10, cursor: 'pointer', fontSize: 16, fontWeight: 500 }}>
            Ver planos
          </button>
        </div>
        <p style={{ fontSize: 13, color: '#AAA', marginTop: 16 }}>Sem cartão de crédito · 3 contratos grátis por mês</p>
      </section>

      {/* Como funciona */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { n: '1', title: 'Preencha os dados', desc: 'Nome das partes, valor, prazo e condições do contrato' },
            { n: '2', title: 'IA gera o contrato', desc: 'Claude cria um contrato jurídico completo em segundos' },
            { n: '3', title: 'Baixe e assine', desc: 'Copie o texto ou baixe em DOCX e envie para assinar' },
          ].map(({ n, title, desc }) => (
            <div key={n} style={{ background: '#fff', border: '1.5px solid #EBEBEB', borderRadius: 12, padding: 24 }}>
              <div style={{ width: 32, height: 32, background: '#111', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600, marginBottom: 14 }}>{n}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Planos */}
      <section id="planos" style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px 96px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, marginBottom: 8, color: '#111', letterSpacing: '-0.5px' }}>Planos simples</h2>
        <p style={{ textAlign: 'center', color: '#888', fontSize: 15, marginBottom: 40 }}>Comece grátis, assine quando precisar de mais</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Free */}
          <div style={{ background: '#fff', border: '1.5px solid #EBEBEB', borderRadius: 16, padding: 28 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#888', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px' }}>Free</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#111', marginBottom: 2 }}>R$0</div>
            <div style={{ fontSize: 13, color: '#AAA', marginBottom: 24 }}>para sempre</div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
              <Feature ok={true} text="3 contratos/mês" />
              <Feature ok={true} text="Prestação de serviço" />
              <Feature ok={true} text="Locação de imóvel" />
              <Feature ok={false} text="Download DOCX" />
              <Feature ok={false} text="Cláusulas extras" />
            </ul>
            <button onClick={() => router.push('/login')} style={{ width: '100%', background: '#fff', color: '#111', border: '1.5px solid #DDD', padding: '11px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>
              Começar grátis
            </button>
          </div>
          {/* Pro */}
          <div style={{ background: '#111', border: '1.5px solid #111', borderRadius: 16, padding: 28, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 14, right: 14, background: '#fff', color: '#111', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, letterSpacing: '.5px' }}>POPULAR</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#666', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.5px' }}>Pro</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 2 }}>R$39,99</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 24 }}>por mês</div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 28 }}>
              {['Contratos ilimitados', 'Prestação de serviço', 'Locação de imóvel', 'Download DOCX', 'Cláusulas extras'].map(f => (
                <li key={f} style={{ padding: '4px 0', display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: '#CCC' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={() => router.push('/login')} style={{ width: '100%', background: '#fff', color: '#111', border: 'none', padding: '11px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              Assinar Pro
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #EBEBEB', background: '#fff', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="8" fill="#111"/>
            <rect x="9" y="9" width="7" height="9" rx="1.5" fill="white"/>
            <rect x="20" y="9" width="7" height="9" rx="1.5" fill="white"/>
            <rect x="9" y="21" width="7" height="6" rx="1.5" fill="white"/>
            <rect x="20" y="21" width="3" height="6" rx="1.5" fill="white"/>
            <rect x="24" y="21" width="3" height="6" rx="1.5" fill="white"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>Contrato Fácil</span>
        </div>
        <p style={{ fontSize: 12, color: '#AAA' }}>© 2026 Contrato Fácil · Contratos gerados por IA para fins informativos</p>
      </footer>
    </main>
  )
}