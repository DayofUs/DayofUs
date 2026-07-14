import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="font-serif text-3xl font-bold mb-2" style={{color:'#2C2C3E'}}>Privacy Policy</h1>
          <p style={{color:'#6B7280'}}>Last updated: July 2026</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6" style={{border:'1px solid #E8DDD8'}}>
          <section>
            <h2 className="font-serif text-xl font-bold mb-2" style={{color:'#2C2C3E'}}>What We Collect</h2>
            <p style={{color:'#475569'}}>
              When you create a Day of Us account, we collect your email address, password (encrypted), and the names you provide for your wedding page. When guests use your wedding page, we collect the information they choose to submit — such as RSVP responses, dietary requirements, messages, and song requests. Guests don't need to create an account to use these features.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold mb-2" style={{color:'#2C2C3E'}}>Sensitive Information</h2>
            <p style={{color:'#475569'}}>
              Dietary requirements submitted by guests may indirectly reveal religious beliefs (e.g. halal, kosher) or health conditions (e.g. allergies, diabetic needs). This information is provided voluntarily by guests, is visible only to the couple whose wedding page it relates to, and is used solely for wedding planning and catering purposes. It is never used for any other purpose, including advertising or profiling.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold mb-2" style={{color:'#2C2C3E'}}>How We Use It</h2>
            <p style={{color:'#475569'}}>
              We use this information solely to provide the Day of Us service — displaying your wedding page, collecting RSVPs and song requests, and showing that information back to you on your dashboard. We do not sell your data or your guests' data to third parties, and we don't use it for advertising.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold mb-2" style={{color:'#2C2C3E'}}>Where Your Data Is Stored and Transferred</h2>
            <p style={{color:'#475569'}}>
              Your data is stored with Supabase, our database provider, in a Singapore-based data centre, and processed by Vercel (our hosting provider) and Resend (our email provider), both of which may process data in the United States. Where your data crosses borders — for example from the EU or UK to Singapore or the US — our providers maintain appropriate safeguards such as Standard Contractual Clauses. Access to your wedding's data is restricted using row-level security, so only you can view and manage it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold mb-2" style={{color:'#2C2C3E'}}>How Long We Keep Your Data</h2>
            <p style={{color:'#475569'}}>
              We retain your wedding page, RSVP responses, and song requests for as long as your account remains active. If you delete your account, your wedding record and all associated guest data (RSVPs, songs, messages) are permanently deleted. We do not currently set an automatic deletion date after your wedding day passes — your data remains available to you unless and until you choose to delete it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold mb-2" style={{color:'#2C2C3E'}}>Cookies</h2>
            <p style={{color:'#475569'}}>
              Day of Us does not currently use advertising or tracking cookies. We use only the minimal cookies required for you to stay logged in securely. If this changes in future, we will update this policy and request consent where required by law.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold mb-2" style={{color:'#2C2C3E'}}>Third-Party Services</h2>
            <p style={{color:'#475569'}}>
              We use the iTunes Search API to power song search on the Playlist tool — no personal data is sent to Apple as part of this. Transactional emails (account confirmation, password resets) are sent via Resend.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold mb-2" style={{color:'#2C2C3E'}}>Your Rights</h2>
            <p style={{color:'#475569'}}>
              Depending on where you live, you may have rights to access, correct, export, or delete your personal data, and to object to or restrict certain processing. You can exercise any of these rights at any time by emailing us — we will respond within a reasonable timeframe and in any case within the timeframe required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold mb-2" style={{color:'#2C2C3E'}}>Changes to This Policy</h2>
            <p style={{color:'#475569'}}>
              We may update this policy as Day of Us grows. We'll update the "Last updated" date above whenever we do, and for material changes we'll make reasonable efforts to notify account holders directly.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-bold mb-2" style={{color:'#2C2C3E'}}>Contact Us</h2>
            <p style={{color:'#475569'}}>
              Questions about this policy or your data? Email us at{' '}
              <a href="mailto:hello@dayofus.org" style={{color:'#B07D6E', fontWeight:600}}>hello@dayofus.org</a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
