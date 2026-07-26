export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import DashboardClient from '@/app/dashboard/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: rsvps } = wedding ? await supabase
    .from('rsvps')
    .select('*')
    .eq('wedding_id', wedding.id)
    .order('created_at', { ascending: false }) : { data: [] }

  const { data: songs } = wedding ? await supabase
    .from('song_requests')
    .select('*')
    .eq('wedding_id', wedding.id)
    .order('created_at', { ascending: false }) : { data: [] }

  const { data: photos } = wedding ? await supabase
    .from('wedding_photos')
    .select('*')
    .eq('wedding_id', wedding.id)
    .order('created_at', { ascending: false }) : { data: [] }

  const { data: wishes } = wedding ? await supabase
    .from('wishes')
    .select('*')
    .eq('wedding_id', wedding.id)
    .order('created_at', { ascending: false }) : { data: [] }

  const { data: budget } = wedding ? await supabase
    .from('wedding_budgets')
    .select('*')
    .eq('wedding_id', wedding.id)
    .maybeSingle() : { data: null }

  const { data: checklist } = wedding ? await supabase
    .from('wedding_checklist')
    .select('*')
    .eq('wedding_id', wedding.id)
    .maybeSingle() : { data: null }

  const { data: venueComparison } = wedding ? await supabase
    .from('wedding_venues')
    .select('*')
    .eq('wedding_id', wedding.id)
    .maybeSingle() : { data: null }

  return (
    <>
      <Header />
      <DashboardClient
        user={user}
        wedding={wedding}
        rsvps={rsvps || []}
        songs={songs || []}
        photos={photos || []}
        wishes={wishes || []}
        budget={budget}
        checklist={checklist}
        venueComparison={venueComparison}
      />
    </>
  )
}
