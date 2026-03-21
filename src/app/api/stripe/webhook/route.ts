import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (e) {
    console.error('Webhook erro:', e)
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId

    if (userId) {
      await supabaseAdmin.from('users').update({
        plano: 'pro',
        stripe_id: session.customer as string
      }).eq('id', userId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string

    await supabaseAdmin.from('users').update({
      plano: 'free'
    }).eq('stripe_id', customerId)
  }

  return NextResponse.json({ received: true })
}

