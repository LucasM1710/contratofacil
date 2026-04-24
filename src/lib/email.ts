import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function enviarEmailSegundoContrato(email: string) {
  await resend.emails.send({
    from: 'Contrato Fácil <onboarding@resend.dev>',
    to: email,
    subject: 'Você já usou 2 dos seus 3 contratos grátis',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: 700;">Contrato Fácil</span>
        </div>
        
        <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 12px;">
          Você já usou 2 dos seus 3 contratos grátis 📄
        </h2>
        
        <p style="color: #555; font-size: 15px; line-height: 1.7; margin-bottom: 20px;">
          Olá! Vimos que você já gerou 2 contratos no plano Free. 
          Falta apenas <strong>1 contrato</strong> para atingir o limite mensal.
        </p>

        <div style="background: #F7F7F7; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #555; margin-bottom: 12px; font-weight: 600;">Com o plano Pro você tem:</p>
          <p style="font-size: 14px; color: #444; margin: 6px 0;">✓ Contratos ilimitados</p>
          <p style="font-size: 14px; color: #444; margin: 6px 0;">✓ Download em DOCX</p>
          <p style="font-size: 14px; color: #444; margin: 6px 0;">✓ Cláusulas personalizadas</p>
          <p style="font-size: 14px; color: #444; margin: 6px 0;">✓ Histórico completo</p>
        </div>

        <a href="https://contratofacil.vercel.app/dashboard" 
           style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; margin-bottom: 24px;">
          Assinar Pro por R$39,99/mês →
        </a>

        <p style="color: #AAA; font-size: 12px; line-height: 1.6;">
          Você está recebendo este email porque tem uma conta no Contrato Fácil.<br>
          contratofacil.vercel.app
        </p>
      </div>
    `
  })
}

export async function enviarEmailLimiteBloqueado(email: string) {
  await resend.emails.send({
    from: 'Contrato Fácil <onboarding@resend.dev>',
    to: email,
    subject: 'Você atingiu o limite do plano Free',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #111;">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 20px; font-weight: 700;">Contrato Fácil</span>
        </div>
        
        <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 12px;">
          Limite do plano Free atingido 🔒
        </h2>
        
        <p style="color: #555; font-size: 15px; line-height: 1.7; margin-bottom: 20px;">
          Você usou todos os 3 contratos gratuitos deste mês. 
          Para continuar gerando contratos ilimitados assine o plano Pro.
        </p>

        <div style="background: #111; border-radius: 10px; padding: 20px; margin-bottom: 24px; color: #fff;">
          <p style="font-size: 22px; font-weight: 700; margin-bottom: 4px;">R$39,99<span style="font-size: 14px; font-weight: 400; color: #888;">/mês</span></p>
          <p style="font-size: 13px; color: #888; margin-bottom: 16px;">Cancele quando quiser</p>
          <p style="font-size: 14px; color: #CCC; margin: 6px 0;">✓ Contratos ilimitados</p>
          <p style="font-size: 14px; color: #CCC; margin: 6px 0;">✓ Download em DOCX</p>
          <p style="font-size: 14px; color: #CCC; margin: 6px 0;">✓ Cláusulas personalizadas</p>
        </div>

        <a href="https://contratofacil.vercel.app/dashboard" 
           style="display: inline-block; background: #111; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; margin-bottom: 24px;">
          Assinar Pro agora →
        </a>

        <p style="color: #AAA; font-size: 12px; line-height: 1.6;">
          Você está recebendo este email porque tem uma conta no Contrato Fácil.<br>
          contratofacil.vercel.app
        </p>
      </div>
    `
  })
}