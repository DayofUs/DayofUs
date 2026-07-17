import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const guestFeatures = [
  { icon: '✉️', title: 'Guest RSVP', desc: 'A beautiful RSVP form that collects attendance, dietary requirements and messages — all in one place.', color: 'bg-[#E8F0EC]' },
  { icon: '🎵', title: 'Song Requests', desc: 'Guests search and request songs with 30-second previews before adding them to your playlist.', color: 'bg-[#EAE4F5]' },
  { icon: '📸', title: 'QR Photo Gallery', desc: 'Guests scan a QR code at your wedding and upload photos straight from their phone — no app needed.', color: 'bg-[#F5EAE4]' },
  { icon: '💌', title: 'Wishes Wall', desc: 'A dedicated space for guests to leave heartfelt messages for you both.', color: 'bg-[#F5E6C8]' },
  { icon: '📅', title: 'Live Countdown', desc: 'A live countdown to your big day, shown right on your guest page.', color: 'bg-[#E8F0EC]' },
  { icon: '💰', title: 'Budget Planner', desc: 'Track every category of your wedding spend, with AI advice when you need it.', color: 'bg-[#EAE4F5]' },
];

const quickTools = [
  { icon: '💰', title: 'Budget Calculator', desc: 'Try our budget planner instantly, no account needed.', href: '/budget' },
  { icon: '📅', title: 'Countdown Timer', desc: 'A quick live countdown you can share right away.', href: '/countdown' },
  { icon: '✉️', title: 'RSVP Form Demo', desc: 'See how our guest RSVP form works.', href: '/rsvp' },
  { icon: '🎵', title: 'Song Search Demo', desc: 'Try searching and previewing songs.', href: '/playlist' },
  { icon: '📋', title: 'Wedding Checklist', desc: 'A month-by-month planning checklist.', href: '/checklist' },
  { icon: '🏨', title: 'Venue Cost Calculator', desc: 'Compare venue costs side by side.', href: null },
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
                💍 Free Wedding Website & Guest Hub
              </div>
              <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-6" style={{color:'#2C2C3E'}}>
                One Page for Your Wedding,{' '}
                <em className="not-italic" style={{color:'#B07D6E'}}>Everything Included</em>
              </h1>
              <p className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl" style={{color:'#6B7280'}}>
                Create a free wedding page in minutes. Guests RSVP, request songs, upload photos and leave wishes — all from a link you share, no app required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="font-semibold px-8 py-4 rounded-full text-center transition-colors" style={{background:'#B07D6E', color:'#ffffff'}}>
                  Create Your Free Wedding Page
                </Link>
                <Link href="/demo" className="font-semibold px-8 py-4 rounded-full text-center border transition-colors" style={{background:'#ffffff', color:'#2C2C3E', borderColor:'#E8DDD8'}}>
                  See a Live Example
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
                  {[['RSVPs', '87 confirmed'], ['Photos Uploaded', '24'], ['Song Requests', '43 songs']].map(([label, val]) => (
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
              {[['Free', 'To get started'], ['$19', 'One-time, no subscription'], ['No App', 'Needed for guests'], ['5 Min', 'To set up your page']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="font-serif text-3xl md:text-4xl font-bold mb-1" style={{color:'#D4AF7A'}}>{num}</div>
                  <div className="text-sm" style={{color:'#9CA3AF'}}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What your wedding page includes */}
        <section className="py-20" style={{background:'#FDFAF7'}}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{color:'#B07D6E'}}>Your Wedding Page</div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>Everything Your Guests Need, One Link</h2>
              <p className="max-w-xl mx-auto" style={{color:'#6B7280'}}>Share one link and your guests can do it all — no separate apps or logins.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guestFeatures.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
                  <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>{f.icon}</div>
                  <h3 className="font-semibold text-lg mb-2" style={{color:'#2C2C3E'}}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{color:'#6B7280'}}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20" style={{background:'#F5EAE4'}}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>Simple, Honest Pricing</h2>
              <p style={{color:'#6B7280'}}>Start free. Upgrade only if you want more — one payment, no subscription.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-white rounded-2xl p-8" style={{border:'1px solid #E8DDD8'}}>
                <div className="text-sm font-semibold uppercase tracking-wider mb-2" style={{color:'#6B7280'}}>Free</div>
                <div className="font-serif text-4xl font-bold mb-6" style={{color:'#2C2C3E'}}>$0</div>
                <ul className="space-y-3 mb-8">
                  {['Your own wedding page & shareable link', 'Guest RSVPs (up to 75 guests)', 'Song requests with previews', 'Photo gallery via QR code (up to 30 photos)', 'Budget planner & live countdown'].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{color:'#475569'}}>
                      <span style={{color:'#7A9E8A'}}>✓</span> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block text-center font-semibold py-3.5 rounded-xl" style={{background:'#F5EAE4', color:'#B07D6E'}}>
                  Start Free
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-8 relative" style={{border:'2px solid #B07D6E'}}>
                <span className="absolute -top-3 left-8 text-xs font-semibold px-3 py-1 rounded-full" style={{background:'#B07D6E', color:'#ffffff'}}>One-time payment</span>
                <div className="text-sm font-semibold uppercase tracking-wider mb-2" style={{color:'#B07D6E'}}>Premium</div>
                <div className="font-serif text-4xl font-bold mb-6" style={{color:'#2C2C3E'}}>$19</div>
                <ul className="space-y-3 mb-8">
                  {['Everything in Free, plus:', 'Unlimited photo uploads', 'Unlimited guests', 'Custom link (dayofus.org/w/yourname)', 'Wishes wall for guest messages', 'PDF export of guest list & playlist'].map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{color: item.startsWith('Everything') ? '#6B7280' : '#475569', fontStyle: item.startsWith('Everything') ? 'italic' : 'normal'}}>
                      {!item.startsWith('Everything') && <span style={{color:'#7A9E8A'}}>✓</span>} {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="block text-center font-semibold py-3.5 rounded-xl" style={{background:'#B07D6E', color:'#ffffff'}}>
                  Sign Up & Upgrade
                </Link>
                <p className="text-xs text-center mt-3" style={{color:'#6B7280'}}>Create your free account first, then upgrade instantly from your dashboard</p>
              </div>

            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20" style={{background:'#FDFAF7'}}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>How It Works</h2>
              <p style={{color:'#6B7280'}}>Set up in minutes. No design skills needed.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Sign up free', desc: 'Create your account with your names and email — your wedding page is ready instantly.' },
                { step: '2', title: 'Add your details', desc: 'Set your wedding date, venue and a message to guests from your dashboard.' },
                { step: '3', title: 'Share your link', desc: 'Send your guest link out. They RSVP, request songs, upload photos and leave wishes.' },
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

        {/* Quick tools, no signup */}
        <section className="py-20" style={{background:'#F5EAE4'}}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="text-sm font-semibold uppercase tracking-wider mb-3" style={{color:'#B07D6E'}}>No Account Needed</div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>Try Our Free Quick Tools</h2>
              <p className="max-w-xl mx-auto" style={{color:'#6B7280'}}>Want to try things out first? These work instantly, no sign-up required.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickTools.map((t) => (
                t.href ? (
                  <Link key={t.title} href={t.href} className="group bg-white rounded-2xl p-6 transition-all hover:shadow-lg" style={{border:'1px solid #E8DDD8'}}>
                    <div className="text-2xl mb-3">{t.icon}</div>
                    <h3 className="font-semibold mb-1" style={{color:'#2C2C3E'}}>{t.title}</h3>
                    <p className="text-sm" style={{color:'#6B7280'}}>{t.desc}</p>
                  </Link>
                ) : (
                  <div key={t.title} className="bg-white rounded-2xl p-6 relative" style={{border:'1px solid #E8DDD8', opacity: 0.7}}>
                    <span className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full" style={{background:'#F5EAE4', color:'#B07D6E'}}>Coming Soon</span>
                    <div className="text-2xl mb-3">{t.icon}</div>
                    <h3 className="font-semibold mb-1" style={{color:'#2C2C3E'}}>{t.title}</h3>
                    <p className="text-sm" style={{color:'#6B7280'}}>{t.desc}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20" style={{background:'#FDFAF7'}}>
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="text-4xl mb-6">💍</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>Ready to Create Your Wedding Page?</h2>
            <p className="mb-8 text-lg" style={{color:'#6B7280'}}>Free to start. Ready in minutes. Upgrade only if you want to.</p>
            <Link href="/signup" className="inline-block font-semibold px-10 py-4 rounded-full transition-colors" style={{background:'#B07D6E', color:'#ffffff'}}>
              Create Your Free Wedding Page
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
