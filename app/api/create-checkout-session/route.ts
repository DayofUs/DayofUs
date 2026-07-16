import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  const { data: wedding } = await supabase
    .from('weddings')
    .select('id, is_premium')
    .eq('user_id', user.id)
    .single()

  if (!wedding) {
    return NextResponse.json({ error: 'No wedding found' }, { status: 404 })
  }

  if (wedding.is_premium) {
    return NextResponse.json({ error: 'Already premium' }, { status: 400 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dayofus.org'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/dashboard?upgraded=true`,
    cancel_url: `${siteUrl}/dashboard`,
    metadata: {
      wedding_id: wedding.id,
    },
  })

  return NextResponse.json({ url: session.url })
}
