'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

const CATEGORIES = [
  { key: 'venue', label: 'Venue', icon: '🏛️', typical: 35 },
  { key: 'catering', label: 'Catering & Drinks', icon: '🍾', typical: 25 },
  { key: 'photography', label: 'Photography & Video', icon: '📸', typical: 10 },
  { key: 'flowers', label: 'Flowers & Decor', icon: '💐', typical: 8 },
  { key: 'music', label: 'Music & Entertainment', icon: '🎵', typical: 5 },
  { key: 'dress', label: 'Dress & Attire', icon: '👗', typical: 7 },
  { key: 'cake', label: 'Wedding Cake', icon: '🎂', typical: 2 },
  { key: 'transport', label: 'Transport', icon: '🚗', typical: 2 },
  { key: 'stationery', label: 'Stationery & Invites', icon: '✉️', typical: 2 },
  { key: 'honeymoon', label: 'Honeymoon', icon: '✈️', typical: 0 },
  { key: 'rings', label: 'Rings', icon: '💍', typical: 3 },
  { key: 'other', label: 'Other', icon: '📋', typical: 1 },
];

export default function BudgetPage() {
  const [totalBudget, setTotalBudget] = useState<string>('');
  const [guests, setGuests] = useState<string>('');
  const [allocations, setAllocations] = useState<Record<string, string>>({});
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);

  const budget = parseFloat(totalBudget) || 0;
  const guestCount = parseInt(guests) || 0;

  const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  const remaining = budget - totalAllocated;
  const perHead = guestCount > 0 && budget > 0 ? budget / guestCount : 0;

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
    const breakdown = CATEGORIES.map(c => `${c.label}: £${allocations[c.key] || 0}`).join(', ');
    const prompt = `Wedding Budget Analysis:\nTotal budget: £${budget}\nGuests: ${guestCount}\nCost per head: £${perHead.toFixed(0)}\nBreakdown: ${breakdown}\n\nPlease analyse this wedding budget. Is it realistic? What are the biggest risks of overspending? What tips would help them stay on budget? What should they prioritise?`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: 'You are a helpful wedding budget adviser. Give practical, friendly advice to couples planning their wedding. Keep responses concise and warm. Strip all markdown formatting — no asterisks, hashes, or bullet symbols.',
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || 'Unable to generate advice. Please try again.';
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

        {/* Page header */}
        <div className="text-center mb-10">
          <div className="text-sm font-semibold text-[#B07D6E] uppercase tracking-wider mb-3">Free Tool</div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">Wedding Budget Calculator</h1>
          <p className="text-[#6B7280] max-w-xl mx-auto">Set your total budget, enter your guest count, and get a realistic breakdown of what to spend on each category — plus AI advice tailored to your budget.</p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-[#E8DDD8] shadow-sm overflow-hidden mb-8">

          {/* Card header */}
          <div className="bg-gradient-to-r from-[#2C2C3E] to-[#B07D6E] p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-xl">💰</div>
              <span className="font-semibold text-white text-lg">Wedding Budget Planner</span>
            </div>
            <p className="text-white/70 text-sm ml-[52px]">Plan every category of your big day</p>
          </div>

          <div className="p-6 md:p-8">

            {/* Total budget + guests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-2">Total Wedding Budget</label>
                <div className="flex">
                  <span className="bg-[#F1F5F9] border border-r-0 border-[#E8DDD8] rounded-l-xl px-4 flex items-center text-sm font-bold text-[#475569]">£</span>
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={e => setTotalBudget(e.target.value)}
                    placeholder="e.g. 20000"
                    className="flex-1 h-12 border border-[#E8DDD8] rounded-r-xl bg-[#F8FAFC] px-4 text-navy font-medium outline-none focus:border-[#B07D6E] focus:ring-2 focus:ring-[#B07D6E]/10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-2">Number of Guests</label>
                <input
                  type="number"
                  value={guests}
                  onChange={e => setGuests(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full h-12 border border-[#E8DDD8] rounded-xl bg-[#F8FAFC] px-4 text-navy font-medium outline-none focus:border-[#B07D6E] focus:ring-2 focus:ring-[#B07D6E]/10"
                />
              </div>
            </div>

            {/* Typical split button */}
            <button
              onClick={setTypicalSplit}
              disabled={!budget}
              className="w-full mb-6 py-3 border-2 border-dashed border-[#B07D6E] text-[#B07D6E] rounded-xl text-sm font-semibold hover:bg-[#F5EAE4] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ✨ Apply Typical Wedding Budget Split
            </button>

            {/* Category breakdown */}
            <div className="space-y-3">
              {CATEGORIES.map(cat => (
                <div key={cat.key} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-[#F5EAE4] rounded-lg flex items-center justify-center text-lg flex-shrink-0">{cat.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-navy">{cat.label}</div>
                    {budget > 0 && cat.typical > 0 && (
                      <div className="text-xs text-[#6B7280]">Typical: {cat.typical}%</div>
                    )}
                  </div>
                  <div className="flex items-center border border-[#E8DDD8] rounded-xl overflow-hidden">
                    <span className="bg-[#F1F5F9] px-3 h-10 flex items-center text-sm font-bold text-[#475569] border-r border-[#E8DDD8]">£</span>
                    <input
                      type="number"
                      value={allocations[cat.key] || ''}
                      onChange={e => {
                        setAllocations(prev => ({ ...prev, [cat.key]: e.target.value }));
                        setCalculated(true);
                      }}
                      placeholder="0"
                      className="w-28 h-10 bg-[#F8FAFC] px-3 text-navy text-sm outline-none focus:bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            {calculated && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#2C2C3E] to-[#B07D6E] rounded-xl p-4 text-center">
                  <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Total Budget</div>
                  <div className="font-serif text-2xl font-bold text-white">£{budget.toLocaleString()}</div>
                </div>
                <div className={`rounded-xl p-4 text-center ${remaining >= 0 ? 'bg-[#E8F0EC]' : 'bg-[#FEE2E2]'}`}>
                  <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-1">{remaining >= 0 ? 'Remaining' : 'Overspent'}</div>
                  <div className={`font-serif text-2xl font-bold ${remaining >= 0 ? 'text-[#7A9E8A]' : 'text-red-600'}`}>
                    £{Math.abs(remaining).toLocaleString()}
                  </div>
                </div>
                <div className="bg-[#F5E6C8] rounded-xl p-4 text-center">
                  <div className="text-xs text-[#6B7280] uppercase tracking-wider mb-1">Cost Per Head</div>
                  <div className="font-serif text-2xl font-bold text-[#D4AF7A]">
                    {perHead > 0 ? `£${perHead.toFixed(0)}` : '—'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Section */}
        <div className="bg-white rounded-2xl border border-[#E8DDD8] shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-gradient-to-r from-[#2C2C3E] to-[#B07D6E] text-white text-xs font-bold px-3 py-1 rounded-full">✦ AI</span>
            <span className="font-semibold text-navy">AI Wedding Budget Adviser</span>
          </div>
          <p className="text-sm text-[#6B7280] mb-4">Enter your budget above and click generate for personalised advice on your wedding budget — realistic expectations, where couples overspend, and tips to stay on track.</p>

          {aiResult && (
            <div className="bg-[#F8FAFC] border border-[#E8DDD8] border-l-4 border-l-[#B07D6E] rounded-r-xl p-4 mb-4 text-sm text-navy leading-relaxed whitespace-pre-wrap">
              {aiResult}
            </div>
          )}

          <button
            onClick={runAI}
            disabled={!budget || aiLoading}
            className="w-full bg-[#2C2C3E] text-white font-semibold py-3 rounded-xl hover:bg-[#B07D6E] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {aiLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Generating advice...
              </>
            ) : '✦ Get AI Budget Advice'}
          </button>
          <p className="text-xs text-[#6B7280] mt-3 text-center">Always seek independent financial advice for major purchasing decisions.</p>
        </div>

      </main>
      <Footer />
    </>
  );
}
