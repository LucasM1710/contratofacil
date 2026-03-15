import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  try {
    const { tipo, dados } = await req.json()

    if (!tipo || !dados) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: buildPrompt(tipo, dados) }]
    })

    const contrato = (msg.content[0] as { text: string }).text
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