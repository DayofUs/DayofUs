'use client';
import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (resetError) { setError(resetError.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  };

  if (sent) return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-6">📬</div>
        <h1 className="font-serif text-3xl font-bold mb-4" style={{color:'#2C2C3E'}}>Check Your Email</h1>
        <p style={{color:'#6B7280'}}>We sent a password reset link to <strong style={{color:'#2C2C3E'}}>{email}</strong>. Click it to set a new password.</p>
      </main>
    </>
  );

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔑</div>
          <h1 className="font-serif text-3xl font-bold mb-2" style={{color:'#2C2C3E'}}>Forgot Password?</h1>
          <p style={{color:'#6B7280'}}>Enter your email and we will send you a reset link</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8" style={{border:'1px solid #E8DDD8'}}>
          {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{background:'#FEE2E2', color:'#DC2626'}}>{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReset()} placeholder="you@example.com" className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
            </div>
            <button onClick={handleReset} disabled={loading} className="w-full font-semibold py-3.5 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2" style={{background:'#B07D6E', color:'#ffffff'}}>
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Sending...</> : 'Send Reset Link'}
            </button>
          </div>
          <p className="text-center text-sm mt-6" style={{color:'#6B7280'}}>
            Remember it?{' '}
            <Link href="/login" style={{color:'#B07D6E', fontWeight:600}}>Back to sign in</Link>
          </p>
        </div>
      </main>
    </>
  );
}
