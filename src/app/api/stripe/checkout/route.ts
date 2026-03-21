import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?sucesso=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?cancelado=true`,
      metadata: { userId }
    })

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erro ao criar sessão' }, { status: 500 })
  }
}