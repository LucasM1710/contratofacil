import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()

    const { data: user } = await supabaseAdmin
      .from('users')
      .select('stripe_id')
      .eq('id', userId)
      .single()

    if (!user?.stripe_id) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_id,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erro ao abrir portal' }, { status: 500 })
  }
}