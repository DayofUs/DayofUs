'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';

export default function CountdownPage() {
  const [weddingDate, setWeddingDate] = useState('');
  const [coupleName, setCoupleName] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [active, setActive] = useState(false);

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
