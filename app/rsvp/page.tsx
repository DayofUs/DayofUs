'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function RSVPPage() {
  const [form, setForm] = useState({ name: '', attending: '', guests: '1', dietary: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const [loadingAccount, setLoadingAccount] = useState(true);
  const [weddingSlug, setWeddingSlug] = useState<string | null>(null);
  const [realRsvps, setRealRsvps] = useState<any[]>([]);

  useEffect(() => {
    const loadRealRsvps = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoadingAccount(false);
        return;
      }

      const { data: wedding } = await supabase
        .from('weddings')
        .select('id, slug')
        .eq('user_id', user.id)
        .single();

      if (!wedding) {
        setLoadingAccount(false);
        return;
      }

      setWeddingSlug(wedding.slug);

      const { data: rsvps } = await supabase
        .from('rsvps')
        .select('*')
        .eq('wedding_id', wedding.id)
        .order('created_at', { ascending: false });

      setRealRsvps(rsvps || []);
      setLoadingAccount(false);
    };

    loadRealRsvps();
  }, []);

  const handleSubmit = () => {
    if (!form.name || !form.attending) return;
    setSubmitted(true);
  };

  if (!loadingAccount && weddingSlug) {
    const confirmedGuests = realRsvps.filter(r => r.attending === 'yes').reduce((sum, r) => sum + (r.guests || 1), 0);
    const attending = realRsvps.filter(r => r.attending === 'yes');
    const declined = realRsvps.filter(r => r.attending === 'no');

    return (
      <>
        <Header />
        <main className="max-w-xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">Your Guest RSVPs</h1>
            <p className="text-[#6B7280]">Guests RSVP from your shareable guest page — here's who's responded so far.</p>
          </div>

          <div className="mb-6 p-4 rounded-xl text-sm text-center" style={{background:'#F0FDF4', color:'#16A34A'}}>
            Want more responses? Share your guest link: <Link href={`/w/${weddingSlug}`} className="font-semibold underline">dayofus.org/w/{weddingSlug}</Link>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8DDD8] shadow-sm p-6 md:p-8">
            <h3 className="font-semibold mb-4" style={{color:'#2C2C3E'}}>RSVPs ({realRsvps.length})</h3>
            {realRsvps.length === 0 ? (
              <p className="text-sm" style={{color:'#6B7280'}}>No RSVPs yet — share your guest link above to start collecting responses.</p>
            ) : (
              <>
                {attending.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'#7A9E8A'}}>✅ Attending ({confirmedGuests} guests)</div>
                    <div className="space-y-2">
                      {attending.map(r => (
                        <div key={r.id} className="flex items-center justify-between p-3 rounded-xl" style={{background:'#F0FDF4'}}>
                          <div>
                            <div className="font-medium text-sm" style={{color:'#2C2C3E'}}>{r.guest_name}</div>
                            {r.dietary && <div className="text-xs" style={{color:'#6B7280'}}>Dietary: {r.dietary}</div>}
                          </div>
                          <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{background:'#DCFCE7', color:'#16A34A'}}>{r.guests} {r.guests === 1 ? 'guest' : 'guests'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {declined.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'#DC2626'}}>❌ Declining ({declined.length})</div>
                    <div className="space-y-2">
                      {declined.map(r => (
                        <div key={r.id} className="p-3 rounded-xl" style={{background:'#FEF2F2'}}>
                          <div className="font-medium text-sm" style={{color:'#2C2C3E'}}>{r.guest_name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <p className="text-center text-sm mt-6" style={{color:'#6B7280'}}>
            Not sure how many people to invite? Read our{' '}
            <Link href="/guides/wedding-guest-list-size" className="font-semibold underline" style={{color:'#B07D6E'}}>guest list size guide</Link>.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  if (submitted) return (
    <>
      <Header />
      <main className="max-w-xl mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-6">💍</div>
        <h1 className="font-serif text-3xl font-bold text-navy mb-4">Thank You, {form.name}!</h1>
        <p className="text-[#6B7280] mb-2">{form.attending === 'yes' ? `We cannot wait to celebrate with you!` : `We are sorry you cannot make it, but thank you for letting us know.`}</p>
        {form.message && <div className="mt-6 bg-[#F5EAE4] rounded-xl p-4 text-sm text-navy italic">"{form.message}"</div>}
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">RSVP</h1>
          <p className="text-[#6B7280]">Please let us know if you'll be joining us on our special day.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DDD8] shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#2C2C3E] to-[#B07D6E] p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-xl">✉️</div>
              <span className="font-semibold text-white text-lg">Your RSVP</span>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#475569] mb-2">Your Full Name</label>
              <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="e.g. John Smith" className="w-full h-12 border border-[#E8DDD8] rounded-xl bg-[#F8FAFC] px-4 text-navy outline-none focus:border-[#B07D6E]" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#475569] mb-2">Will you be attending?</label>
              <div className="flex gap-3">
                {[['yes', '✅ Joyfully accepts'], ['no', '❌ Regretfully declines']].map(([val, label]) => (
                  <button key={val} onClick={() => setForm(p => ({...p, attending: val}))} className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${form.attending === val ? 'bg-[#B07D6E] border-[#B07D6E] text-white' : 'bg-white border-[#E8DDD8] text-navy hover:border-[#B07D6E]'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {form.attending === 'yes' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-2">Number of guests (including yourself)</label>
                  <select value={form.guests} onChange={e => setForm(p => ({...p, guests: e.target.value}))} className="w-full h-12 border border-[#E8DDD8] rounded-xl bg-[#F8FAFC] px-4 text-navy outline-none focus:border-[#B07D6E] appearance-none">
                    {['1','2','3','4'].map(n => <option key={n} value={n}>{n} {n === '1' ? 'guest' : 'guests'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-2">Dietary requirements (optional)</label>
                  <input value={form.dietary} onChange={e => setForm(p => ({...p, dietary: e.target.value}))} placeholder="e.g. vegetarian, nut allergy..." className="w-full h-12 border border-[#E8DDD8] rounded-xl bg-[#F8FAFC] px-4 text-navy outline-none focus:border-[#B07D6E]" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#475569] mb-2">Leave a message (optional)</label>
              <textarea value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} placeholder="Share your excitement or well wishes..." rows={3} className="w-full border border-[#E8DDD8] rounded-xl bg-[#F8FAFC] px-4 py-3 text-navy outline-none focus:border-[#B07D6E] resize-none" />
            </div>

            <button onClick={handleSubmit} disabled={!form.name || !form.attending} className="w-full bg-[#B07D6E] text-white font-semibold py-3.5 rounded-xl hover:bg-[#8B5E52] transition-colors disabled:opacity-40">
              Submit RSVP 💍
            </button>
          </div>
        </div>

        <p className="text-center text-sm mt-6" style={{color:'#6B7280'}}>
          Not sure how many people to invite? Read our{' '}
          <Link href="/guides/wedding-guest-list-size" className="font-semibold underline" style={{color:'#B07D6E'}}>guest list size guide</Link>.
        </p>
      </main>
      <Footer />
    </>
  );
}
