import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { enviarEmailSegundoContrato, enviarEmailLimiteBloqueado } from '@/lib/email'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const { tipo, dados, userId, email } = await req.json()

    if (!tipo || !dados) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    // Busca dados do usuário
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('plano, contratos_mes')
      .eq('id', userId)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Bloqueia se free e atingiu limite
    if (user.plano === 'free' && user.contratos_mes >= 3) {
      // Envia email de limite bloqueado se ainda não enviou
      try { await enviarEmailLimiteBloqueado(email) } catch (e) { console.error(e) }
      return NextResponse.json({ 
        error: 'Limite do plano Free atingido. Assine o Pro para continuar.' 
      }, { status: 429 })
    }

    // Gera o contrato
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: buildPrompt(tipo, dados) }]
    })

    const contrato = (msg.content[0] as { text: string }).text

    // Salva o contrato gerado
    await supabaseAdmin.from('contratos').insert({
      user_id: userId,
      ip,
      tipo
    })

    // Atualiza contador
    const novoTotal = user.contratos_mes + 1
    await supabaseAdmin
      .from('users')
      .update({ contratos_mes: novoTotal })
      .eq('id', userId)

    // Envia email no 2º contrato
    if (user.plano === 'free' && novoTotal === 2) {
      try { await enviarEmailSegundoContrato(email) } catch (e) { console.error(e) }
    }

    return NextResponse.json({ contrato })

  } catch (error) {
    console.error('Erro ao gerar contrato:', error)
    return NextResponse.json({ error: 'Erro ao gerar contrato' }, { status: 500 })
  }
}

function buildPrompt(tipo: string, dados: object): string {
  const label = tipo === 'servico' ? 'Prestação de Serviço' : 'Locação de Imóvel'
  return `Você é um assistente jurídico brasileiro especializado em contratos civis.
Gere um contrato profissional, completo e juridicamente válido no Brasil.

Tipo: ${label}
Dados: ${JSON.stringify(dados, null, 2)}

Requisitos:
- Linguagem jurídica formal
- Siga o CC/2002 e leis específicas aplicáveis
- Numere as cláusulas: CLÁUSULA 1ª, CLÁUSULA 2ª...
- Inclua: objeto, obrigações das partes, valor, pagamento, prazo, rescisão, penalidades, foro
- Para locação: Lei do Inquilinato 8.245/91
- Finalize com local, data, assinaturas e 2 testemunhas

Retorne APENAS o texto do contrato, sem comentários nem markdown.`
}