'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function CountdownPage() {
  const [weddingDate, setWeddingDate] = useState('');
  const [coupleName, setCoupleName] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [active, setActive] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [isSynced, setIsSynced] = useState(false);

  // On mount, auto-load the wedding date and names already saved on the account, if logged in
  useEffect(() => {
    const loadWeddingDetails = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoadingAccount(false);
        return;
      }

      const { data: wedding } = await supabase
        .from('weddings')
        .select('partner1_name, partner2_name, wedding_date')
        .eq('user_id', user.id)
        .single();

      if (wedding) {
        if (wedding.partner1_name && wedding.partner2_name) {
          setCoupleName(`${wedding.partner1_name} & ${wedding.partner2_name}`);
        }
        if (wedding.wedding_date) {
          setWeddingDate(wedding.wedding_date);
          setIsSynced(true);
        }
      }

      setLoadingAccount(false);
    };

    loadWeddingDetails();
  }, []);

  useEffect(() => {
    if (!weddingDate) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(weddingDate).getTime();
      const diff = target - now;
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
      setActive(true);
    }, 1000);
    return () => clearInterval(interval);
  }, [weddingDate]);

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">Wedding Countdown</h1>
          <p className="text-[#6B7280]">How many days until your big day? Enter your wedding date for a live countdown.</p>
        </div>

        {!loadingAccount && isSynced && (
          <div className="mb-6 p-4 rounded-xl text-sm text-center" style={{background:'#F0FDF4', color:'#16A34A'}}>
            ✓ Synced from your wedding page — edit your date anytime from your <a href="/dashboard" className="font-semibold underline">dashboard</a>.
          </div>
        )}

        {!loadingAccount && !isSynced && (
          <div className="mb-6 p-4 rounded-xl text-sm text-center" style={{background:'#FEF3C7', color:'#92400E'}}>
            You're not signed in — this won't be remembered next time. <a href="/login" className="font-semibold underline">Sign in</a> or <a href="/signup" className="font-semibold underline">create a free account</a> to sync it automatically.
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#E8DDD8] shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#2C2C3E] to-[#B07D6E] p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-xl">📅</div>
              <span className="font-semibold text-white text-lg">Wedding Day Countdown</span>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-2">Your Names</label>
                <input
                  type="text"
                  value={coupleName}
                  onChange={e => setCoupleName(e.target.value)}
                  placeholder="e.g. Sarah & James"
                  className="w-full h-12 border border-[#E8DDD8] rounded-xl bg-[#F8FAFC] px-4 text-navy outline-none focus:border-[#B07D6E]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-2">Wedding Date</label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={e => setWeddingDate(e.target.value)}
                  className="w-full h-12 border border-[#E8DDD8] rounded-xl bg-[#F8FAFC] px-4 text-navy outline-none focus:border-[#B07D6E]"
                />
              </div>
            </div>

            {active && (
              <div className="text-center">
                {coupleName && <p className="font-serif text-xl text-[#B07D6E] mb-4 italic">{coupleName} are getting married in...</p>}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { val: timeLeft.days, label: 'Days' },
                    { val: timeLeft.hours, label: 'Hours' },
                    { val: timeLeft.minutes, label: 'Mins' },
                    { val: timeLeft.seconds, label: 'Secs' },
                  ].map(({ val, label }) => (
                    <div key={label} className="bg-[#F5EAE4] rounded-2xl p-4">
                      <div className="font-serif text-4xl md:text-5xl font-bold text-[#B07D6E]">{String(val).padStart(2, '0')}</div>
                      <div className="text-xs text-[#6B7280] mt-1 font-medium uppercase tracking-wider">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
