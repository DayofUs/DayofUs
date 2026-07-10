import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const features = [
  {
    icon: '💰',
    title: 'Wedding Budget Calculator',
    desc: 'Plan every penny of your big day with our detailed budget breakdown. Set limits, track spending and get AI advice.',
    href: '/budget',
    color: 'bg-[#F5EAE4]',
  },
  {
    icon: '📅',
    title: 'Wedding Countdown',
    desc: 'A live countdown to your wedding day in days, hours, minutes and seconds. Share it with family and friends.',
    href: '/countdown',
    color: 'bg-[#F5E6C8]',
  },
  {
    icon: '✉️',
    title: 'Guest RSVP',
    desc: 'Create a beautiful RSVP form for your guests. Collect dietary requirements, plus ones and messages.',
    href: '/rsvp',
    color: 'bg-[#E8F0EC]',
  },
  {
    icon: '🎵',
    title: 'Song Request Playlist',
    desc: 'Let your guests upload their song requests before the big day. Share with your DJ or band instantly.',
    href: '/playlist',
    color: 'bg-[#EAE4F5]',
  },
  {
    icon: '📋',
    title: 'Wedding Checklist',
    desc: 'A complete wedding planning checklist from 12 months out to the morning of your wedding day.',
    href: '/checklist',
    color: 'bg-[#F5EAE4]',
  },
  {
    icon: '🏨',
    title: 'Venue Cost Calculator',
    desc: 'Compare venue costs side by side. See the true cost per head including catering, drinks and extras.',
    href: '/venue',
    color: 'bg-[#F5E6C8]',
  },
];

const stats = [
  { num: '100%', label: 'Free to use' },
  { num: '0', label: 'Sign-up required' },
  { num: '6+', label: 'Planning tools' },
  { num: '∞', label: 'Happy couples' },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>

        {/* Hero */}
        <section className="relative overflow-hidden bg-cream">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(176,125,110,0.08),transparent_60%)]"></div>
          <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 relative">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#F5EAE4] border border-[#E8DDD8] rounded-full px-4 py-2 text-sm font-medium text-[#B07D6E] mb-8">
                💍 Free Wedding Planning Tools
              </div>
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-navy leading-tight mb-6">
                Plan Your Perfect Day,{' '}
                <em className="text-[#B07D6E] not-italic">Together</em>
              </h1>
              <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed mb-10 max-w-xl">
                Free wedding budget calculator, guest RSVP, song request playlist and more — all in one place. No account needed to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/budget"
                  className="bg-[#B07D6E] text-white font-semibold px-8 py-4 rounded-full text-center hover:bg-[#8B5E52] transition-colors shadow-lg shadow-[#B07D6E]/20"
                >
                  Start Planning Free
                </Link>
                <Link
                  href="/checklist"
                  className="bg-white text-navy font-semibold px-8 py-4 rounded-full text-center border border-[#E8DDD8] hover:border-[#B07D6E] hover:text-[#B07D6E] transition-colors"
                >
                  View Wedding Checklist
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative element */}
          <div className="hidden lg:block absolute right-0 top-0 h-full w-[40%]">
            <div className="h-full flex items-center justify-center p-12">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-[#E8DDD8]">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-3">💍</div>
                  <div className="font-serif text-xl font-bold text-navy mb-1">Sarah & James</div>
                  <div className="text-sm text-[#6B7280]">Getting married in</div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[['142', 'Days'], ['14', 'Hours'], ['32', 'Mins']].map(([num, label]) => (
                    <div key={label} className="bg-[#F5EAE4] rounded-xl p-3 text-center">
                      <div className="font-serif text-2xl font-bold text-[#B07D6E]">{num}</div>
                      <div className="text-xs text-[#6B7280] mt-1">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm py-2 border-b border-[#F5EAE4]">
                    <span className="text-[#6B7280]">Wedding Budget</span>
                    <span className="font-semibold text-navy">£18,500</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-[#F5EAE4]">
                    <span className="text-[#6B7280]">Guests Confirmed</span>
                    <span className="font-semibold text-navy">87 / 120</span>
                  </div>
                  <div className="flex justify-between text-sm py-2">
                    <span className="text-[#6B7280]">Song Requests</span>
                    <span className="font-semibold text-navy">43 songs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#2C2C3E] py-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map(({ num, label }) => (
                <div key={label} className="text-center">
                  <div className="font-serif text-3xl md:text-4xl font-bold text-[#D4AF7A] mb-1">{num}</div>
                  <div className="text-sm text-gray-400">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="py-20 bg-cream">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <div className="text-sm font-semibold text-[#B07D6E] uppercase tracking-wider mb-3">Everything You Need</div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">Free Wedding Planning Tools</h2>
              <p className="text-[#6B7280] max-w-xl mx-auto">Everything you need to plan your perfect day — and tools your guests will love too.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <Link
                  key={f.title}
                  href={f.href}
                  className="group bg-white rounded-2xl p-6 border border-[#E8DDD8] hover:border-[#B07D6E] hover:shadow-lg hover:shadow-[#B07D6E]/10 transition-all"
                >
                  <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-navy text-lg mb-2 group-hover:text-[#B07D6E] transition-colors">{f.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#B07D6E] opacity-0 group-hover:opacity-100 transition-opacity">
                    Open tool <span>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-[#F5EAE4]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">How It Works</h2>
              <p className="text-[#6B7280] max-w-xl mx-auto">No account needed. No payment required. Just start planning.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '1', title: 'Choose your tool', desc: 'Pick from our wedding budget calculator, countdown timer, RSVP form or playlist uploader.' },
                { step: '2', title: 'Enter your details', desc: 'Fill in your wedding details. Everything is instant — no waiting, no loading screens.' },
                { step: '3', title: 'Share with guests', desc: 'Share your RSVP link, playlist link or countdown with family and friends instantly.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-14 h-14 bg-[#B07D6E] rounded-full flex items-center justify-center mx-auto mb-5">
                    <span className="font-serif text-2xl font-bold text-white">{step}</span>
                  </div>
                  <h3 className="font-semibold text-navy text-lg mb-3">{title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="py-20 bg-cream">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="text-4xl mb-6">💍</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">Ready to Start Planning?</h2>
            <p className="text-[#6B7280] mb-8 text-lg">Join thousands of couples planning their perfect day with Day of Us. Completely free, no sign-up required.</p>
            <Link
              href="/budget"
              className="inline-block bg-[#B07D6E] text-white font-semibold px-10 py-4 rounded-full hover:bg-[#8B5E52] transition-colors shadow-lg shadow-[#B07D6E]/20"
            >
              Start with the Budget Calculator
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
