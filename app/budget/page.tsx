'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD — US Dollar' },
  { code: 'GBP', symbol: '£', label: 'GBP — British Pound' },
  { code: 'EUR', symbol: '€', label: 'EUR — Euro' },
  { code: 'AUD', symbol: 'A$', label: 'AUD — Australian Dollar' },
  { code: 'CAD', symbol: 'C$', label: 'CAD — Canadian Dollar' },
  { code: 'NZD', symbol: 'NZ$', label: 'NZD — New Zealand Dollar' },
  { code: 'SGD', symbol: 'S$', label: 'SGD — Singapore Dollar' },
  { code: 'ZAR', symbol: 'R', label: 'ZAR — South African Rand' },
  { code: 'INR', symbol: '₹', label: 'INR — Indian Rupee' },
  { code: 'AED', symbol: 'AED', label: 'AED — UAE Dirham' },
];

const CATEGORIES = [
  { key: 'venue', label: 'Venue', icon: '🏛️', typical: 35 },
  { key: 'catering', label: 'Catering & Drinks', icon: '🍾', typical: 25 },
  { key: 'photography', label: 'Photography & Video', icon: '📸', typical: 10 },
  { key: 'flowers', label: 'Flowers & Decor', icon: '💐', typical: 8 },
  { key: 'music', label: 'Music & Entertainment', icon: '🎵', typical: 5 },
  { key: 'dress', label: 'Dress & Attire', icon: '👗', typical: 7 },
  { key: 'cake', label: 'Wedding Cake', icon: '🎂', typical: 2 },
  { key: 'transport', label: 'Transport', icon: '🚗', typical: 2 },
  { key: 'stationery', label: 'Invites & Stationery', icon: '✉️', typical: 2 },
  { key: 'honeymoon', label: 'Honeymoon', icon: '✈️', typical: 0 },
  { key: 'rings', label: 'Rings', icon: '💍', typical: 3 },
  { key: 'other', label: 'Other', icon: '📋', typical: 1 },
];

export default function BudgetPage() {
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [totalBudget, setTotalBudget] = useState('');
  const [guests, setGuests] = useState('');
  const [allocations, setAllocations] = useState<Record<string, string>>({});
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);

  const budget = parseFloat(totalBudget) || 0;
  const guestCount = parseInt(guests) || 0;
  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  const remaining = budget - totalAllocated;
  const perHead = guestCount > 0 && budget > 0 ? budget / guestCount : 0;
  const sym = currency.symbol;

  const fmt = (n: number) => `${sym}${n.toLocaleString()}`;

  const setTypicalSplit = () => {
    if (!budget) return;
    const newAllocations: Record<string, string> = {};
    CATEGORIES.forEach(cat => {
      newAllocations[cat.key] = cat.typical > 0 ? ((budget * cat.typical) / 100).toFixed(0) : '';
    });
    setAllocations(newAllocations);
    setCalculated(true);
  };

  const runAI = async () => {
    setAiLoading(true);
    const breakdown = CATEGORIES.map(c => `${c.label}: ${sym}${allocations[c.key] || 0}`).join(', ');
    const prompt = `Wedding Budget Analysis:\nCurrency: ${currency.code}\nTotal budget: ${sym}${budget}\nGuests: ${guestCount}\nCost per head: ${sym}${perHead.toFixed(0)}\nBreakdown: ${breakdown}\n\nPlease analyse this wedding budget. Is it realistic for the currency/country? What are the biggest risks of overspending? What tips would help them stay on budget?`;
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: 'You are a helpful wedding budget adviser for couples worldwide. Give practical, warm advice relevant to the couple\'s currency and likely location. Keep responses concise. Strip all markdown — no asterisks, hashes or bullet symbols.',
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || data.error || 'Unable to generate advice. Please try again.';
      setAiResult(text.replace(/[#*_`]/g, '').trim());
    } catch {
      setAiResult('Something went wrong. Please try again.');
    }
    setAiLoading(false);
  };

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{color:'#B07D6E'}}>Free Tool</div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>Wedding Budget Calculator</h1>
          <p className="max-w-xl mx-auto" style={{color:'#6B7280'}}>Set your total budget, choose your currency, and get a realistic breakdown — plus AI advice tailored to your wedding.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8" style={{border:'1px solid #E8DDD8'}}>
          <div className="p-6" style={{background:'linear-gradient(135deg, #2C2C3E, #B07D6E)'}}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background:'rgba(255,255,255,0.15)'}}>💰</div>
              <span className="font-semibold text-lg" style={{color:'#ffffff'}}>Wedding Budget Planner</span>
            </div>
          </div>

          <div className="p-6 md:p-8">

            {/* Currency selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Your Currency</label>
              <div className="relative">
                <select
                  value={currency.code}
                  onChange={e => setCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])}
                  className="w-full h-12 px-4 rounded-xl outline-none appearance-none"
                  style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E', paddingRight:'40px'}}
                >
                  {CURRENCIES.map(c => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{color:'#475569'}}>▾</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Total Wedding Budget</label>
                <div className="flex">
                  <span className="px-4 flex items-center text-sm font-bold rounded-l-xl flex-shrink-0" style={{background:'#F1F5F9', border:'1px solid #E8DDD8', borderRight:'none', color:'#475569'}}>{sym}</span>
                  <input type="number" value={totalBudget} onChange={e => setTotalBudget(e.target.value)} placeholder="e.g. 20000" className="flex-1 h-12 px-4 outline-none rounded-r-xl min-w-0" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Number of Guests</label>
                <input type="number" value={guests} onChange={e => setGuests(e.target.value)} placeholder="e.g. 100" className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
              </div>
            </div>

            <button onClick={setTypicalSplit} disabled={!budget} className="w-full mb-6 py-3 rounded-xl text-sm font-semibold disabled:opacity-40" style={{border:'2px dashed #B07D6E', color:'#B07D6E', background:'transparent'}}>
              ✨ Apply Typical Wedding Budget Split
            </button>

            {/* Categories — mobile-friendly layout */}
            <div className="space-y-3">
              {CATEGORIES.map(cat => (
                <div key={cat.key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl" style={{background:'#FDFAF7', border:'1px solid #F0E8E4'}}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{background:'#F5EAE4'}}>{cat.icon}</div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium" style={{color:'#2C2C3E'}}>{cat.label}</div>
                      {budget > 0 && cat.typical > 0 && <div className="text-xs" style={{color:'#6B7280'}}>Typical: {cat.typical}%</div>}
                    </div>
                  </div>
                  <div className="flex items-center rounded-xl overflow-hidden flex-shrink-0" style={{border:'1px solid #E8DDD8'}}>
                    <span className="px-3 h-10 flex items-center text-sm font-bold flex-shrink-0" style={{background:'#F1F5F9', borderRight:'1px solid #E8DDD8', color:'#475569'}}>{sym}</span>
                    <input type="number" value={allocations[cat.key] || ''} onChange={e => { setAllocations(prev => ({ ...prev, [cat.key]: e.target.value })); setCalculated(true); }} placeholder="0" className="w-28 h-10 px-3 text-sm outline-none" style={{background:'#F8FAFC', color:'#2C2C3E'}} />
                  </div>
                </div>
              ))}
            </div>

            {calculated && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl p-4 text-center" style={{background:'linear-gradient(135deg, #2C2C3E, #B07D6E)'}}>
                  <div className="text-xs uppercase tracking-wider mb-1" style={{color:'rgba(255,255,255,0.6)'}}>Total Budget</div>
                  <div className="font-serif text-2xl font-bold" style={{color:'#ffffff'}}>{fmt(budget)}</div>
                </div>
                <div className="rounded-xl p-4 text-center" style={{background: remaining >= 0 ? '#E8F0EC' : '#FEE2E2'}}>
                  <div className="text-xs uppercase tracking-wider mb-1" style={{color:'#6B7280'}}>{remaining >= 0 ? 'Remaining' : 'Overspent'}</div>
                  <div className="font-serif text-2xl font-bold" style={{color: remaining >= 0 ? '#7A9E8A' : '#DC2626'}}>{fmt(Math.abs(remaining))}</div>
                </div>
                <div className="rounded-xl p-4 text-center" style={{background:'#F5E6C8'}}>
                  <div className="text-xs uppercase tracking-wider mb-1" style={{color:'#6B7280'}}>Per Head</div>
                  <div className="font-serif text-2xl font-bold" style={{color:'#D4AF7A'}}>{perHead > 0 ? fmt(Math.round(perHead)) : '—'}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8" style={{border:'1px solid #E8DDD8'}}>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white text-xs font-bold px-3 py-1 rounded-full" style={{background:'linear-gradient(135deg, #2C2C3E, #B07D6E)'}}>✦ AI</span>
            <span className="font-semibold" style={{color:'#2C2C3E'}}>AI Wedding Budget Adviser</span>
          </div>
          <p className="text-sm mb-4" style={{color:'#6B7280'}}>Enter your budget above and click generate for personalised advice — realistic expectations, where couples typically overspend, and tips to stay on track.</p>
          {aiResult && (
            <div className="rounded-r-xl p-4 mb-4 text-sm leading-relaxed whitespace-pre-wrap" style={{background:'#F8FAFC', border:'1px solid #E8DDD8', borderLeft:'4px solid #B07D6E', color:'#2C2C3E'}}>
              {aiResult}
            </div>
          )}
          <button onClick={runAI} disabled={!budget || aiLoading} className="w-full font-semibold py-3 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2" style={{background:'#2C2C3E', color:'#ffffff'}}>
            {aiLoading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Generating advice...</> : '✦ Get AI Budget Advice'}
          </button>
          <p className="text-xs mt-3 text-center" style={{color:'#6B7280'}}>Always seek independent financial advice for major purchasing decisions.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
