'use client';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Wedding {
  id: string;
  partner1_name: string;
  partner2_name: string;
  wedding_date: string | null;
  total_budget: number | null;
  currency: string;
}

interface User {
  id: string;
  email?: string;
}

export default function DashboardClient({ user, wedding }: { user: User; wedding: Wedding | null }) {
  const [weddingDate, setWeddingDate] = useState(wedding?.wedding_date || '');
  const [savingDate, setSavingDate] = useState(false);
  const [dateSaved, setDateSaved] = useState(false);
  const router = useRouter();

  const coupleName = wedding ? `${wedding.partner1_name} & ${wedding.partner2_name}` : 'Your Wedding';

  const daysUntil = weddingDate
    ? Math.ceil((new Date(weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const saveDate = async () => {
    if (!weddingDate || !wedding) return;
    setSavingDate(true);
    const supabase = createClient();
    await supabase
      .from('weddings')
      .update({ wedding_date: weddingDate })
      .eq('id', wedding.id);
    setSavingDate(false);
    setDateSaved(true);
    setTimeout(() => { setDateSaved(false); router.refresh(); }, 1500);
  };

  const tools = [
    { icon: '💰', title: 'Budget Planner', desc: 'Track your wedding budget by category', href: '/budget', color: '#F5EAE4' },
    { icon: '📅', title: 'Countdown', desc: 'Live countdown to your wedding day', href: '/countdown', color: '#F5E6C8' },
    { icon: '✉️', title: 'Guest RSVP', desc: 'Share with guests to collect responses', href: '/rsvp', color: '#E8F0EC' },
    { icon: '🎵', title: 'Song Requests', desc: 'Let guests request songs for the day', href: '/playlist', color: '#EAE4F5' },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">

      <div className="mb-8">
        <div className="text-sm font-semibold uppercase tracking-wider mb-2" style={{color:'#B07D6E'}}>Your Wedding Dashboard</div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold" style={{color:'#2C2C3E'}}>{coupleName} 💍</h1>
      </div>

      {!wedding?.wedding_date && (
        <div className="mb-8 rounded-2xl p-6 md:p-8" style={{background:'linear-gradient(135deg, #F5EAE4, #FDF6F3)', border:'2px solid #E8DDD8'}}>
          <div className="flex items-start gap-4">
            <div className="text-3xl">📅</div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg mb-1" style={{color:'#2C2C3E'}}>When is your big day?</h2>
              <p className="text-sm mb-4" style={{color:'#6B7280'}}>Add your wedding date to unlock your live countdown and personalise your dashboard.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="date"
                  value={weddingDate}
                  onChange={e => setWeddingDate(e.target.value)}
                  className="flex-1 h-12 px-4 rounded-xl outline-none"
                  style={{border:'1px solid #E8DDD8', background:'#ffffff', color:'#2C2C3E'}}
                />
                <button
                  onClick={saveDate}
                  disabled={!weddingDate || savingDate}
                  className="px-6 h-12 rounded-xl font-semibold text-sm disabled:opacity-40 flex-shrink-0"
                  style={{background:'#B07D6E', color:'#ffffff'}}
                >
                  {dateSaved ? '✓ Saved!' : savingDate ? 'Saving...' : 'Save Date'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Days to go', value: daysUntil !== null && daysUntil > 0 ? daysUntil.toLocaleString() : '—' },
          { label: 'Wedding date', value: wedding?.wedding_date ? new Date(wedding.wedding_date).toLocaleDateString('en-GB', {day:'numeric', month:'short', year:'numeric'}) : 'Not set' },
          { label: 'Budget', value: wedding?.total_budget ? `${wedding.currency}${Number(wedding.total_budget).toLocaleString()}` : '—' },
          { label: 'Guests', value: '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-4 text-center" style={{border:'1px solid #E8DDD8'}}>
            <div className="font-serif text-xl font-bold mb-1 truncate" style={{color:'#2C2C3E'}}>{value}</div>
            <div className="text-xs" style={{color:'#6B7280'}}>{label}</div>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>Your Planning Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map(t => (
            <Link key={t.title} href={t.href} className="bg-white rounded-2xl p-6 flex items-center gap-4 transition-all hover:shadow-md" style={{border:'1px solid #E8DDD8'}}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background:t.color}}>{t.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold" style={{color:'#2C2C3E'}}>{t.title}</div>
                <div className="text-sm" style={{color:'#6B7280'}}>{t.desc}</div>
              </div>
              <div className="flex-shrink-0" style={{color:'#B07D6E'}}>→</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
        <h2 className="font-semibold mb-3" style={{color:'#2C2C3E'}}>Account</h2>
        <p className="text-sm mb-4" style={{color:'#6B7280'}}>Signed in as <strong style={{color:'#2C2C3E'}}>{user.email}</strong></p>
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-sm font-semibold px-4 py-2 rounded-xl" style={{background:'#F5EAE4', color:'#B07D6E'}}>
            Sign Out
          </button>
        </form>
      </div>

    </main>
  );
}
