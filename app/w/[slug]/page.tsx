import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import GuestPage from './GuestPage'

export default async function WeddingGuestPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!wedding) notFound()

  const { data: rsvps } = await supabase
    .from('rsvps')
    .select('*')
    .eq('wedding_id', wedding.id)
    .order('created_at', { ascending: false })

  const { data: songs } = await supabase
    .from('song_requests')
    .select('*')
    .eq('wedding_id', wedding.id)
    .order('created_at', { ascending: false })

  const { data: photos } = await supabase
    .from('wedding_photos')
    .select('*')
    .eq('wedding_id', wedding.id)
    .order('created_at', { ascending: false })

  return <GuestPage wedding={wedding} rsvps={rsvps || []} songs={songs || []} photos={photos || []} />
}
