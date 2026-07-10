'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function RSVPPage() {
  const [form, setForm] = useState({ name: '', attending: '', guests: '1', dietary: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.name || !form.attending) return;
    setSubmitted(true);
  };

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
      </main>
      <Footer />
    </>
  );
}
