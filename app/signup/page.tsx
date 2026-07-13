'use client';
import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSignup = async () => {
    if (!partner1 || !partner2 || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { partner1_name: partner1, partner2_name: partner2 },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  };

  if (sent) return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-6">📬</div>
        <h1 className="font-serif text-3xl font-bold mb-4" style={{color:'#2C2C3E'}}>Check Your Email</h1>
        <p style={{color:'#6B7280'}}>We sent a confirmation link to <strong style={{color:'#2C2C3E'}}>{email}</strong>. Click it to activate your account and start planning.</p>
      </main>
    </>
  );

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">💍</div>
          <h1 className="font-serif text-3xl font-bold mb-2" style={{color:'#2C2C3E'}}>Start Planning Free</h1>
          <p style={{color:'#6B7280'}}>Create your wedding planning dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8" style={{border:'1px solid #E8DDD8'}}>
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{background:'#FEE2E2', color:'#DC2626'}}>{error}</div>
          )}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Partner 1</label>
                <input type="text" value={partner1} onChange={e => setPartner1(e.target.value)} placeholder="First name" className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Partner 2</label>
                <input type="text" value={partner2} onChange={e => setPartner2(e.target.value)} placeholder="First name" className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSignup()} placeholder="Minimum 6 characters" className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
            </div>
            <button onClick={handleSignup} disabled={loading} className="w-full font-semibold py-3.5 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2" style={{background:'#B07D6E', color:'#ffffff'}}>
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Creating account...</> : 'Create Free Account'}
            </button>
          </div>
          <p className="text-center text-sm mt-6" style={{color:'#6B7280'}}>
            Already have an account?{' '}
            <Link href="/login" style={{color:'#B07D6E', fontWeight:600}}>Sign in</Link>
          </p>
        </div>
      </main>
    </>
  );
}
