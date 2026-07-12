'use client';
import Header from '@/components/Header';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!password || !confirm) { setError('Please fill in both fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) { setError(updateError.message); setLoading(false); return; }
    setSuccess(true);
    setTimeout(() => router.push('/dashboard'), 2000);
  };

  if (success) return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="text-5xl mb-6">✅</div>
        <h1 className="font-serif text-3xl font-bold mb-4" style={{color:'#2C2C3E'}}>Password Updated</h1>
        <p style={{color:'#6B7280'}}>Redirecting you to your dashboard...</p>
      </main>
    </>
  );

  return (
    <>
      <Header />
      <main className="max-w-md mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="font-serif text-3xl font-bold mb-2" style={{color:'#2C2C3E'}}>Set New Password</h1>
          <p style={{color:'#6B7280'}}>Choose a strong password for your account</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-8" style={{border:'1px solid #E8DDD8'}}>
          {error && <div className="mb-4 p-3 rounded-xl text-sm" style={{background:'#FEE2E2', color:'#DC2626'}}>{error}</div>}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>New Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 characters" className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password" className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
            </div>
            <button onClick={handleReset} disabled={loading} className="w-full font-semibold py-3.5 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2" style={{background:'#B07D6E', color:'#ffffff'}}>
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Updating...</> : 'Update Password'}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
