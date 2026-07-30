import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Wedding Budget Breakdown: How Much to Spend on Each Category | Day of Us',
  description: 'A realistic wedding budget breakdown by category — venue, catering, photography, and more — plus a free calculator to plan your own.',
};

const breakdown = [
  { category: 'Venue', percent: 35, note: 'Usually the single biggest line item — includes ceremony and reception space hire.' },
  { category: 'Catering & Drinks', percent: 25, note: 'Food, drinks, and often service staff. Scales directly with your guest count.' },
  { category: 'Photography & Video', percent: 10, note: 'These are the memories that outlast the day itself — most couples don\'t regret spending here.' },
  { category: 'Flowers & Decor', percent: 8, note: 'Centrepieces, bouquets, ceremony decor. Easy to scale up or down depending on style.' },
  { category: 'Music & Entertainment', percent: 5, note: 'DJ, band, or a simple playlist — costs vary hugely depending on what you choose.' },
  { category: 'Dress & Attire', percent: 7, note: 'Covers both partners\' outfits, alterations, and accessories.' },
  { category: 'Wedding Cake', percent: 2, note: 'Often overlooked in early planning, but worth budgeting for early.' },
  { category: 'Transport', percent: 2, note: 'Getting the wedding party (and sometimes guests) where they need to be.' },
  { category: 'Invites & Stationery', percent: 2, note: 'Invitations, save-the-dates, place cards, and signage.' },
  { category: 'Rings', percent: 3, note: 'Wedding bands — separate from any engagement ring already purchased.' },
  { category: 'Other / Miscellaneous', percent: 1, note: 'Always worth keeping a small buffer for the unexpected.' },
];

export default function WeddingBudgetBreakdownPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>Wedding Budget Breakdown: How Much to Spend on Each Category</h1>
          <p style={{color:'#6B7280'}}>Every wedding is different, but most couples end up following a similar rough split once venue, catering, and the big-ticket items are accounted for. Here's a realistic breakdown to use as a starting point.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 md:p-8 mb-8" style={{border:'1px solid #E8DDD8'}}>
          <div className="space-y-5">
            {breakdown.map(item => (
              <div key={item.category} className="flex items-start justify-between gap-4 pb-4" style={{borderBottom:'1px solid #F0E8E4'}}>
                <div className="flex-1">
                  <div className="font-semibold text-sm mb-1" style={{color:'#2C2C3E'}}>{item.category}</div>
                  <div className="text-sm" style={{color:'#6B7280'}}>{item.note}</div>
                </div>
                <div className="font-serif text-2xl font-bold flex-shrink-0" style={{color:'#B07D6E'}}>{item.percent}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="prose max-w-none mb-8" style={{color:'#475569'}}>
          <h2 className="font-serif text-2xl font-bold mb-3" style={{color:'#2C2C3E'}}>A Few Things Worth Knowing</h2>
          <p className="mb-4 text-sm leading-relaxed">These percentages are a guide, not a rule. If photography matters more to you than flowers, shift the split accordingly — there's no "correct" wedding budget, only the one that reflects what actually matters to you as a couple.</p>
          <p className="mb-4 text-sm leading-relaxed">Venue and catering together typically make up 60% of most wedding budgets, since both scale directly with guest count. If you're trying to reduce your overall spend, cutting your guest list has a bigger impact than trimming almost any other category.</p>
          <p className="text-sm leading-relaxed">It's also worth keeping a small contingency — even a modest 3-5% buffer — since almost every wedding has at least one unexpected cost that shows up late in planning.</p>
        </div>

        <div className="text-center bg-white rounded-2xl p-8" style={{border:'1px solid #E8DDD8'}}>
          <div className="text-3xl mb-4">💰</div>
          <h3 className="font-serif text-2xl font-bold mb-2" style={{color:'#2C2C3E'}}>Plan Your Own Budget, Free</h3>
          <p className="text-sm mb-6" style={{color:'#6B7280'}}>Use our free calculator to apply this exact split to your own budget, then adjust each category to fit your priorities — plus get AI-powered advice tailored to your numbers.</p>
          <Link href="/budget" className="inline-block font-semibold px-8 py-4 rounded-full" style={{background:'#B07D6E', color:'#ffffff'}}>
            Try the Free Budget Calculator
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
