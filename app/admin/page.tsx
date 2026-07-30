export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'

// Only emails listed in ADMIN_EMAILS (Vercel env var, comma-separated) can view this page
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean)

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email || !ADMIN_EMAILS.includes(user.email)) {
    redirect('/dashboard')
  }

  // Admin client bypasses RLS to see aggregate stats across all weddings
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: weddings } = await supabaseAdmin
    .from('weddings')
    .select('id, partner1_name, partner2_name, is_premium, created_at, slug')
    .order('created_at', { ascending: false })

  const { count: rsvpCount } = await supabaseAdmin
    .from('rsvps')
    .select('id', { count: 'exact', head: true })

  const { count: songCount } = await supabaseAdmin
    .from('song_requests')
    .select('id', { count: 'exact', head: true })

  const { count: photoCount } = await supabaseAdmin
    .from('wedding_photos')
    .select('id', { count: 'exact', head: true })

  const { count: wishCount } = await supabaseAdmin
    .from('wishes')
    .select('id', { count: 'exact', head: true })

  const totalSignups = weddings?.length || 0
  const premiumCount = weddings?.filter(w => w.is_premium).length || 0
  const conversionRate = totalSignups > 0 ? ((premiumCount / totalSignups) * 100).toFixed(1) : '0'

  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const signupsLast7Days = weddings?.filter(w => new Date(w.created_at) >= sevenDaysAgo).length || 0

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="text-sm font-semibold uppercase tracking-wider mb-2" style={{color:'#B07D6E'}}>Admin Only</div>
          <h1 className="font-serif text-3xl font-bold" style={{color:'#2C2C3E'}}>Day of Us Stats</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Signups', value: totalSignups },
            { label: 'Premium Upgrades', value: premiumCount },
            { label: 'Conversion Rate', value: `${conversionRate}%` },
            { label: 'New (Last 7 Days)', value: signupsLast7Days },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl p-4 text-center" style={{border:'1px solid #E8DDD8'}}>
              <div className="font-serif text-2xl font-bold mb-1" style={{color:'#2C2C3E'}}>{value}</div>
              <div className="text-xs" style={{color:'#6B7280'}}>{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total RSVPs', value: rsvpCount || 0 },
            { label: 'Song Requests', value: songCount || 0 },
            { label: 'Photos Uploaded', value: photoCount || 0 },
            { label: 'Wishes Left', value: wishCount || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl p-4 text-center" style={{border:'1px solid #E8DDD8'}}>
              <div className="font-serif text-2xl font-bold mb-1" style={{color:'#B07D6E'}}>{value}</div>
              <div className="text-xs" style={{color:'#6B7280'}}>{label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
          <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>Recent Signups</h2>
          {(!weddings || weddings.length === 0) ? (
            <p className="text-sm" style={{color:'#6B7280'}}>No signups yet.</p>
          ) : (
            <div className="space-y-2">
              {weddings.slice(0, 20).map(w => (
                <div key={w.id} className="flex items-center justify-between p-3 rounded-xl" style={{background:'#F8FAFC'}}>
                  <div>
                    <div className="font-medium text-sm" style={{color:'#2C2C3E'}}>{w.partner1_name} & {w.partner2_name}</div>
                    <div className="text-xs" style={{color:'#6B7280'}}>{new Date(w.created_at).toLocaleDateString()} · {w.slug}</div>
                  </div>
                  {w.is_premium && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{background:'#F5EAE4', color:'#B07D6E'}}>Premium</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
