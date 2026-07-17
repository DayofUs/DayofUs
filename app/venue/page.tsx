'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

interface Venue {
  id: string;
  name: string;
  hireCost: string;
  perHead: string;
  guestCount: string;
  extras: string;
}

const emptyVenue = (): Venue => ({
  id: Math.random().toString(36).slice(2),
  name: '',
  hireCost: '',
  perHead: '',
  guestCount: '100',
  extras: '',
});

export default function VenuePage() {
  const [venues, setVenues] = useState<Venue[]>([emptyVenue(), emptyVenue()]);

  const updateVenue = (id: string, field: keyof Venue, value: string) => {
    setVenues(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const addVenue = () => {
    if (venues.length >= 4) return;
    setVenues(prev => [...prev, emptyVenue()]);
  };

  const removeVenue = (id: string) => {
    if (venues.length <= 1) return;
    setVenues(prev => prev.filter(v => v.id !== id));
  };

  const calculateTotal = (v: Venue) => {
    const hire = parseFloat(v.hireCost) || 0;
    const perHead = parseFloat(v.perHead) || 0;
    const guests = parseFloat(v.guestCount) || 0;
    const extras = parseFloat(v.extras) || 0;
    return hire + (perHead * guests) + extras;
  };

  const calculatePerHead = (v: Venue) => {
    const guests = parseFloat(v.guestCount) || 0;
    if (guests === 0) return 0;
    return calculateTotal(v) / guests;
  };

  const cheapest = venues.reduce((min, v) => {
    const total = calculateTotal(v);
    return (total > 0 && (min === null || total < calculateTotal(min))) ? v : min;
  }, null as Venue | null);

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>Venue Cost Calculator</h1>
          <p style={{color:'#6B7280'}}>Compare venues side by side and see the true total cost — including catering, drinks and extras — not just the headline hire fee.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {venues.map((v) => {
            const total = calculateTotal(v);
            const perHead = calculatePerHead(v);
            const isCheapest = cheapest && v.id === cheapest.id && total > 0;
            return (
              <div key={v.id} className="bg-white rounded-2xl p-6 relative" style={{border: isCheapest ? '2px solid #7A9E8A' : '1px solid #E8DDD8'}}>
                {isCheapest && (
                  <span className="absolute -top-3 left-6 text-xs font-semibold px-3 py-1 rounded-full" style={{background:'#7A9E8A', color:'#ffffff'}}>Best Value</span>
                )}
                {venues.length > 1 && (
                  <button onClick={() => removeVenue(v.id)} className="absolute top-4 right-4 text-xs" style={{color:'#DC2626'}}>Remove</button>
                )}
                <input
                  value={v.name}
                  onChange={e => updateVenue(v.id, 'name', e.target.value)}
                  placeholder="Venue name"
                  className="w-full h-12 px-4 rounded-xl outline-none font-semibold mb-4"
                  style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}}
                />
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{color:'#475569'}}>Venue Hire ($)</label>
                    <input type="number" value={v.hireCost} onChange={e => updateVenue(v.id, 'hireCost', e.target.value)} placeholder="0" className="w-full h-11 px-3 rounded-lg outline-none text-sm" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{color:'#475569'}}>Per Head ($)</label>
                    <input type="number" value={v.perHead} onChange={e => updateVenue(v.id, 'perHead', e.target.value)} placeholder="0" className="w-full h-11 px-3 rounded-lg outline-none text-sm" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{color:'#475569'}}>Guest Count</label>
                    <input type="number" value={v.guestCount} onChange={e => updateVenue(v.id, 'guestCount', e.target.value)} placeholder="100" className="w-full h-11 px-3 rounded-lg outline-none text-sm" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{color:'#475569'}}>Extras ($)</label>
                    <input type="number" value={v.extras} onChange={e => updateVenue(v.id, 'extras', e.target.value)} placeholder="0" className="w-full h-11 px-3 rounded-lg outline-none text-sm" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
                  </div>
                </div>
                <div className="pt-3" style={{borderTop:'1px solid #E8DDD8'}}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm" style={{color:'#6B7280'}}>Total Cost</span>
                    <span className="font-serif text-2xl font-bold" style={{color:'#2C2C3E'}}>${total.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs" style={{color:'#6B7280'}}>Cost per head</span>
                    <span className="text-sm font-semibold" style={{color:'#B07D6E'}}>${perHead.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {venues.length < 4 && (
          <button onClick={addVenue} className="w-full mb-10 py-3.5 rounded-xl font-semibold text-sm" style={{background:'#F5EAE4', color:'#B07D6E', border:'1px dashed #B07D6E'}}>
            + Add Another Venue to Compare
          </button>
        )}

        <div className="text-center bg-white rounded-2xl p-8" style={{border:'1px solid #E8DDD8'}}>
          <div className="text-3xl mb-4">🏨</div>
          <h3 className="font-serif text-2xl font-bold mb-2" style={{color:'#2C2C3E'}}>Track Your Whole Budget</h3>
          <p className="text-sm mb-6" style={{color:'#6B7280'}}>Once you've picked a venue, plan every other category of your wedding spend with our full budget planner.</p>
          <Link href="/signup" className="inline-block font-semibold px-8 py-4 rounded-full" style={{background:'#B07D6E', color:'#ffffff'}}>
            Create Your Free Wedding Page
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
