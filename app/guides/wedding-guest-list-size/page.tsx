import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How Many Wedding Guests Should You Invite? | Day of Us',
  description: 'A practical guide to deciding your wedding guest list size — from intimate gatherings to large celebrations, and how to actually make the cut.',
};

const sizes = [
  { range: '10–30 guests', label: 'Intimate', note: 'Immediate family and closest friends only. Often allows a much smaller budget per guest to go further on quality — venue, food, and photography.' },
  { range: '50–100 guests', label: 'Medium', note: 'The most common range. Extended family, close friends, and a handful of colleagues. Balances intimacy with a real celebration atmosphere.' },
  { range: '100–150 guests', label: 'Large', note: 'Wider family and friend circles, often including plus-ones and colleagues. Venue capacity and catering logistics become bigger factors.' },
  { range: '150+ guests', label: 'Very Large', note: 'Big extended families, cultural or religious expectations, or simply a couple who wants everyone they know there. Requires careful logistics planning.' },
];

export default function WeddingGuestListSizePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "How Many Wedding Guests Should You Invite?",
            description: "A practical guide to deciding your wedding guest list size — from intimate gatherings to large celebrations, and how to actually make the cut.",
            author: { "@type": "Organization", name: "Day of Us" },
            publisher: {
              "@type": "Organization",
              name: "Day of Us",
              logo: { "@type": "ImageObject", url: "https://www.dayofus.org/icon-512.png" },
            },
          }),
        }}
      />
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>How Many Wedding Guests Should You Invite?</h1>
          <p style={{color:'#6B7280'}}>There's no universally "right" number — but most couples land somewhere on this spectrum, and each size comes with real tradeoffs worth thinking through before you start writing the list.</p>
        </div>

        <div className="space-y-4 mb-8">
          {sizes.map(s => (
            <div key={s.range} className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
              <div className="flex items-baseline gap-3 mb-2">
                <h2 className="font-serif text-xl font-bold" style={{color:'#2C2C3E'}}>{s.range}</h2>
                <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{background:'#F5EAE4', color:'#B07D6E'}}>{s.label}</span>
              </div>
              <p className="text-sm leading-relaxed" style={{color:'#6B7280'}}>{s.note}</p>
            </div>
          ))}
        </div>

        <div className="mb-8" style={{color:'#475569'}}>
          <h2 className="font-serif text-2xl font-bold mb-3" style={{color:'#2C2C3E'}}>A Few Ways to Actually Cut the List</h2>
          <p className="mb-4 text-sm leading-relaxed">If your list feels too big for your venue or budget, a few common approaches: set a rule (only guests both partners have personally spoken to in the last year), separate "must invite" from "would be nice," or consider a smaller ceremony with a larger reception for those who can only attend part of the day.</p>
          <p className="mb-4 text-sm leading-relaxed">Remember that not everyone you invite will attend — real-world RSVP rates typically land between 80-90% for local guests, lower for destination weddings. It's worth planning your final numbers with that gap in mind rather than assuming a 100% turnout.</p>
          <p className="text-sm leading-relaxed">Whatever number you land on, tracking who's actually confirmed — rather than just who was invited — is what your final catering counts and seating chart will actually depend on.</p>
        </div>

        <div className="text-center bg-white rounded-2xl p-8" style={{border:'1px solid #E8DDD8'}}>
          <div className="text-3xl mb-4">✉️</div>
          <h3 className="font-serif text-2xl font-bold mb-2" style={{color:'#2C2C3E'}}>Track Your Real Guest List, Free</h3>
          <p className="text-sm mb-6" style={{color:'#6B7280'}}>Create a free wedding page with a real RSVP form — track who's actually confirmed, their meal choices, and dietary needs, all in one place. Free for up to 75 confirmed guests.</p>
          <Link href="/signup" className="inline-block font-semibold px-8 py-4 rounded-full" style={{background:'#B07D6E', color:'#ffffff'}}>
            Create Your Free Wedding Page
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
