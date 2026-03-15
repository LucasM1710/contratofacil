'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', background: '#FAFAFA', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #E0E0E0', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
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
        <button
          onClick={() => router.push('/dashboard')}
          style={{ background: '#111', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
          Começar grátis
        </button>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: 680, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: '#AAA', marginBottom: 16 }}>Powered by Claude AI</p>
        <h1 style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.15, marginBottom: 20, color: '#AAA' }}>
          Contratos jurídicos<br />em <em style={{ color: '#555', fontStyle: 'italic' }}>segundos</em>
        </h1>
        <p style={{ fontSize: 18, color: '#666', marginBottom: 40, lineHeight: 1.6 }}>
          Prestação de serviço e locação de imóvel.<br />Gerado com IA, válido no Brasil.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ background: '#111', color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 500 }}>
            Gerar contrato grátis
          </button>
          <button
            onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ background: '#fff', color: '#111', border: '1.5px solid #CCC', padding: '14px 28px', borderRadius: 8, cursor: 'pointer', fontSize: 16, fontWeight: 500 }}>
            Ver planos
          </button>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 600, marginBottom: 32, color: '#AAA' }}>Planos</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Free */}
          <div style={{ background: '#fff', border: '1.5px solid #E0E0E0', borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, color: '#111' }}>Free</div>
            <div style={{ fontSize: 30, fontWeight: 500, marginBottom: 16, color: '#111' }}>R$0<span style={{ fontSize: 14, color: '#999' }}>/mês</span></div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24, color: '#666', fontSize: 14 }}>
              {['3 contratos/mês', 'Prestação de serviço', 'Locação de imóvel'].map(f => (
                <li key={f} style={{ padding: '3px 0' }}>✓ {f}</li>
              ))}
              {['Download DOCX', 'Cláusulas extras'].map(f => (
                <li key={f} style={{ padding: '3px 0', color: '#111' }}>– {f}</li>
              ))}
            </ul>
            <button onClick={() => router.push('/dashboard')} style={{ width: '100%', background: '#fff', border: '1.5px solid #CCC', padding: '10px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 500, color: '#666' }}>
              Começar grátis
            </button>
          </div>
          {/* Pro */}
          <div style={{ background: '#111', border: '1.5px solid #111', borderRadius: 12, padding: 24, color: '#fff' }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Pro</div>
            <div style={{ fontSize: 30, fontWeight: 500, marginBottom: 16 }}>R$37<span style={{ fontSize: 14, color: '#777' }}>/mês</span></div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 24, color: '#BBB', fontSize: 14 }}>
              {['Ilimitado', 'Prestação de serviço', 'Locação de imóvel', 'Download DOCX', 'Cláusulas extras'].map(f => (
                <li key={f} style={{ padding: '3px 0' }}>✓ {f}</li>
              ))}
            </ul>
            <button onClick={() => router.push('/dashboard')} style={{ width: '100%', background: '#fff', color: '#111', border: 'none', padding: '10px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
              Assinar Pro
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}