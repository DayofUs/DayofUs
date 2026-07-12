'use client';
import Header from '@/components/Header';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">💍</div>
          <h1 className="font-serif text-3xl font-bold mb-2" style={{color:'#2C2C3E'}}>Welcome Back</h1>
          <p style={{color:'#6B7280'}}>Sign in to your wedding planning dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8" style={{border:'1px solid #E8DDD8'}}>
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm" style={{background:'#FEE2E2', color:'#DC2626'}}>{error}</div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="you@example.com" className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="Your password" className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
              <div className="text-right mt-1">
                <Link href="/forgot-password" className="text-xs" style={{color:'#B07D6E'}}>Forgot password?</Link>
              </div>
            </div>
            <button onClick={handleLogin} disabled={loading} className="w-full font-semibold py-3.5 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2" style={{background:'#B07D6E', color:'#ffffff'}}>
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Signing in...</> : 'Sign In'}
            </button>
          </div>
          <p className="text-center text-sm mt-6" style={{color:'#6B7280'}}>
            Don't have an account?{' '}
            <Link href="/signup" style={{color:'#B07D6E', fontWeight:600}}>Create one free</Link>
          </p>
        </div>
      </main>
    </>
  );
}
