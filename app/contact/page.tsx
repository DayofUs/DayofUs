import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="text-4xl mb-4">💌</div>
          <h1 className="font-serif text-3xl font-bold mb-2" style={{color:'#2C2C3E'}}>Get in Touch</h1>
          <p style={{color:'#6B7280'}}>Questions, feedback, or need a hand? We'd love to hear from you.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 text-center" style={{border:'1px solid #E8DDD8'}}>
          <p className="mb-4" style={{color:'#2C2C3E'}}>
            The best way to reach us is by email — we read every message and typically reply within 1-2 business days.
          </p>
          <a
            href="mailto:hello@dayofus.org"
            className="inline-block font-semibold px-6 py-3 rounded-xl"
            style={{background:'#B07D6E', color:'#ffffff'}}
          >
            hello@dayofus.org
          </a>
        </div>

        <div className="mt-8 text-center text-sm" style={{color:'#6B7280'}}>
          <p>Whether it's a bug report, a feature idea, or a question about your wedding page — just send us a note.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
