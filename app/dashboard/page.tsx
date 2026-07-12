import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Get wedding details
  const { data: wedding } = await supabase
    .from('weddings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const coupleName = wedding ? `${wedding.partner1_name} & ${wedding.partner2_name}` : 'Your Wedding'

  const daysUntil = wedding?.wedding_date
    ? Math.ceil((new Date(wedding.wedding_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const tools = [
    { icon: '💰', title: 'Budget Planner', desc: 'Track your wedding budget by category', href: '/budget', color: '#F5EAE4' },
    { icon: '📅', title: 'Countdown', desc: 'Live countdown to your wedding day', href: '/countdown', color: '#F5E6C8' },
    { icon: '✉️', title: 'Guest RSVP', desc: 'Manage your guest responses', href: '/rsvp', color: '#E8F0EC' },
    { icon: '🎵', title: 'Song Requests', desc: 'Collect songs from your guests', href: '/playlist', color: '#EAE4F5' },
  ]

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">

        {/* Welcome header */}
        <div className="mb-10">
          <div className="text-sm font-semibold uppercase tracking-wider mb-2" style={{color:'#B07D6E'}}>Your Wedding Dashboard</div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2" style={{color:'#2C2C3E'}}>{coupleName} 💍</h1>
          {daysUntil !== null && daysUntil > 0 && (
            <p className="text-lg" style={{color:'#6B7280'}}>
              <span className="font-bold" style={{color:'#B07D6E'}}>{daysUntil} days</span> until your wedding
            </p>
          )}
          {!wedding?.wedding_date && (
            <p style={{color:'#6B7280'}}>Add your wedding date to see your countdown</p>
          )}
        </div>

        {/* Quick stats */}
        {wedding && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { label: 'Days to go', value: daysUntil !== null && daysUntil > 0 ? daysUntil.toString() : '—' },
              { label: 'Wedding date', value: wedding.wedding_date ? new Date(wedding.wedding_date).toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'}) : 'Not set' },
              { label: 'Budget', value: wedding.total_budget ? `$${Number(wedding.total_budget).toLocaleString()}` : 'Not set' },
              { label: 'Guests', value: '—' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl p-4 text-center" style={{border:'1px solid #E8DDD8'}}>
                <div className="font-serif text-xl font-bold mb-1" style={{color:'#2C2C3E'}}>{value}</div>
                <div className="text-xs" style={{color:'#6B7280'}}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tools grid */}
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>Your Planning Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map(t => (
              <Link key={t.title} href={t.href} className="bg-white rounded-2xl p-6 flex items-center gap-4 transition-all hover:shadow-md" style={{border:'1px solid #E8DDD8'}}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background:t.color}}>{t.icon}</div>
                <div>
                  <div className="font-semibold" style={{color:'#2C2C3E'}}>{t.title}</div>
                  <div className="text-sm" style={{color:'#6B7280'}}>{t.desc}</div>
                </div>
                <div className="ml-auto" style={{color:'#B07D6E'}}>→</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
          <h2 className="font-semibold mb-4" style={{color:'#2C2C3E'}}>Account</h2>
          <p className="text-sm mb-4" style={{color:'#6B7280'}}>Signed in as <strong>{user.email}</strong></p>
          <form action="/auth/signout" method="post">
            <button type="submit" className="text-sm font-semibold px-4 py-2 rounded-xl" style={{background:'#F5EAE4', color:'#B07D6E'}}>
              Sign Out
            </button>
          </form>
        </div>

      </main>
    </>
  )
}
