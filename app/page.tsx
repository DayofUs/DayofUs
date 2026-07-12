import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const features = [
  { icon: '💰', title: 'Wedding Budget Calculator', desc: 'Plan every penny of your big day with our detailed budget breakdown. Set limits, track spending and get AI advice.', href: '/budget', color: 'bg-[#F5EAE4]' },
  { icon: '📅', title: 'Wedding Countdown', desc: 'A live countdown to your wedding day in days, hours, minutes and seconds. Share it with family and friends.', href: '/countdown', color: 'bg-[#F5E6C8]' },
  { icon: '✉️', title: 'Guest RSVP', desc: 'Create a beautiful RSVP form for your guests. Collect dietary requirements, plus ones and messages.', href: '/rsvp', color: 'bg-[#E8F0EC]' },
  { icon: '🎵', title: 'Song Request Playlist', desc: 'Let your guests search and request songs before the big day. 30-second previews included.', href: '/playlist', color: 'bg-[#EAE4F5]' },
  { icon: '📋', title: 'Wedding Checklist', desc: 'A complete wedding planning checklist from 12 months out to the morning of your wedding day.', href: '/checklist', color: 'bg-[#F5EAE4]' },
  { icon: '🏨', title: 'Venue Cost Calculator', desc: 'Compare venue costs side by side. See the true cost per head including catering, drinks and extras.', href: '/venue', color: 'bg-[#F5E6C8]' },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>

        {/* Hero */}
        <section className="relative overflow-hidden" style={{background:'#FDFAF7'}}>
          <div className="absolute inset-0" style={{background:'radial-gradient(circle at 70% 50%, rgba(176,125,110,0.08), transparent 60%)'}}></div>
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-8" style={{background:'#F5EAE4', border:'1px solid #E8DDD8', color:'#B07D6E'}}>
                💍 Free Wedding Planning Tools
              </div>
              <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-6" style={{color:'#2C2C3E'}}>
                Plan Your Perfect Day,{' '}
                <em className="not-italic" style={{color:'#B07D6E'}}>Together</em>
              </h1>
              <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl" style={{color:'#6B7280'}}>
                Free wedding budget calculator, guest RSVP, song request playlist and more — all in one place. No account needed to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/budget" className="font-semibold px-8 py-4 rounded-full text-center transition-colors" style={{background:'#B07D6E', color:'#ffffff'}}>
                  Start Planning Free
                </Link>
                <Link href="/rsvp" className="font-semibold px-8 py-4 rounded-full text-center border transition-colors" style={{background:'#ffffff', color:'#2C2C3E', borderColor:'#E8DDD8'}}>
                  Set Up Guest RSVP
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative card — desktop only */}
          <div className="hidden lg:block absolute right-0 top-0 h-full w-[40%]">
            <div className="h-full flex items-center justify-center p-12">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full" style={{border:'1px solid #E8DDD8'}}>
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">💍</div>
                  <div className="font-serif text-xl font-bold mb-1" style={{color:'#2C2C3E'}}>Sarah &amp; James</div>
                  <div className="text-sm" style={{color:'#6B7280'}}>Getting married in</div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[['142', 'Days'], ['14', 'Hours'], ['32', 'Mins']].map(([num, label]) => (
                    <div key={label} className="rounded-xl p-3 text-center" style={{background:'#F5EAE4'}}>
                      <div className="font-serif text-2xl font-bold" style={{color:'#B07D6E'}}>{num}</div>
                      <div className="text-xs mt-1" style={{color:'#6B7280'}}>{label}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[['Wedding Budget', '£18,500'], ['Guests Confirmed', '87 / 120'], ['Song Requests', '43 songs']].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm py-2" style={{borderBottom:'1px solid #F5EAE4'}}>
                      <span style={{color:'#6B7280'}}>{label}</span>
                      <span className="font-semibold" style={{color:'#2C2C3E'}}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="py-12" style={{background:'#2C2C3E'}}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[['100%', 'Free to use'], ['0', 'Sign-up required'], ['6+', 'Planning tools'], ['∞', 'Happy couples']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="font-serif text-3xl md:text-4xl font-bold mb-1" style={{color:'#D4AF7A'}}>{num}</div>
                  <div className="text-sm" style={{color:'#9CA3AF'}}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20" style={{background:'#FDFAF7'}}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{color:'#B07D6E'}}>Everything You Need</div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>Free Wedding Planning Tools</h2>
              <p className="max-w-xl mx-auto" style={{color:'#6B7280'}}>Everything you need to plan your perfect day — and tools your guests will love too.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <Link key={f.title} href={f.href} className="group bg-white rounded-2xl p-6 transition-all hover:shadow-lg" style={{border:'1px solid #E8DDD8'}}>
                  <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>{f.icon}</div>
                  <h3 className="font-semibold text-lg mb-2" style={{color:'#2C2C3E'}}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color:'#6B7280'}}>{f.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20" style={{background:'#F5EAE4'}}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>How It Works</h2>
              <p style={{color:'#6B7280'}}>No account needed. No payment required. Just start planning.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Choose your tool', desc: 'Pick from our wedding budget calculator, countdown timer, RSVP form or playlist uploader.' },
                { step: '2', title: 'Enter your details', desc: 'Fill in your wedding details. Everything is instant — no waiting, no loading screens.' },
                { step: '3', title: 'Share with guests', desc: 'Share your RSVP link, playlist link or countdown with family and friends instantly.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{background:'#B07D6E'}}>
                    <span className="font-serif text-2xl font-bold" style={{color:'#ffffff'}}>{step}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-3" style={{color:'#2C2C3E'}}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{color:'#6B7280'}}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20" style={{background:'#FDFAF7'}}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="text-4xl mb-6">💍</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>Ready to Start Planning?</h2>
            <p className="mb-8 text-lg" style={{color:'#6B7280'}}>Free wedding planning tools for every couple. No sign-up required.</p>
            <Link href="/budget" className="inline-block font-semibold px-10 py-4 rounded-full transition-colors" style={{background:'#B07D6E', color:'#ffffff'}}>
              Start with the Budget Calculator
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
