'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const router = useRouter()
  const [modo, setModo] = useState<'login' | 'cadastro'>('login')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setErro('')
    setSucesso('')
    try {
      if (modo === 'cadastro') {
        const { error } = await supabase.auth.signUp({ email, password: senha })
        if (error) throw error
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'CompleteRegistration')
        }
        setSucesso('Conta criada! Enviamos um link de confirmação para seu email. Verifique sua caixa de entrada e spam.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : 'Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    fontFamily: 'inherit', fontSize: 14, padding: '12px 14px',
    border: '1.5px solid #E5E5E5', borderRadius: 8, background: '#FAFAFA',
    color: '#111', width: '100%', boxSizing: 'border-box', outline: 'none'
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F7F7F7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 32 }}>
        <svg width="40" height="40" viewBox="0 0 36 36" fill="none">
          <rect width="36" height="36" rx="8" fill="#111"/>
          <rect x="9" y="9" width="7" height="9" rx="1.5" fill="white"/>
          <rect x="20" y="9" width="7" height="9" rx="1.5" fill="white"/>
          <rect x="9" y="21" width="7" height="6" rx="1.5" fill="white"/>
          <rect x="20" y="21" width="3" height="6" rx="1.5" fill="white"/>
          <rect x="24" y="21" width="3" height="6" rx="1.5" fill="white"/>
        </svg>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#111', letterSpacing: '.3px' }}>Contrato Fácil</span>
      </div>

      {/* Card */}
      <div style={{ background: '#fff', border: '1.5px solid #E5E5E5', borderRadius: 16, padding: '36px 32px', width: '100%', maxWidth: 400 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', background: '#F5F5F5', borderRadius: 8, padding: 4, marginBottom: 28, gap: 4 }}>
          {(['login', 'cadastro'] as const).map(m => (
            <button key={m} onClick={() => { setModo(m); setErro(''); setSucesso('') }}
              style={{ flex: 1, padding: '8px 0', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, background: modo === m ? '#fff' : 'transparent', color: modo === m ? '#111' : '#888', boxShadow: modo === m ? '0 1px 4px rgba(0,0,0,.08)' : 'none', transition: 'all .15s' }}>
              {m === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 500, color: '#AAA', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 6 }}>Email</label>
            <input style={inp} type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 500, color: '#AAA', textTransform: 'uppercase', letterSpacing: '.4px', display: 'block', marginBottom: 6 }}>Senha</label>
            <input style={inp} type="password" placeholder="mínimo 6 caracteres" value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          {erro && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', color: '#991B1B', fontSize: 13 }}>⚠ {erro}</div>}
          {sucesso && <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '10px 14px', color: '#166534', fontSize: 13 }}>✓ {sucesso}</div>}

          <button onClick={handleSubmit} disabled={loading}
            style={{ background: loading ? '#999' : '#111', color: '#fff', border: 'none', padding: '13px 0', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4, transition: 'background .15s' }}>
            {loading ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta grátis'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: '#AAA', marginTop: 20, lineHeight: 1.6 }}>
          Ao criar sua conta você concorda com os<br />
          <span style={{ color: '#111', textDecoration: 'underline', cursor: 'pointer' }}>Termos de Uso</span> e <span style={{ color: '#111', textDecoration: 'underline', cursor: 'pointer' }}>Política de Privacidade</span>
        </p>
      </div>

      <p style={{ fontSize: 13, color: '#AAA', marginTop: 24 }}>
        Plano gratuito disponível · sem cartão de crédito
      </p>
    </main>
  )
}