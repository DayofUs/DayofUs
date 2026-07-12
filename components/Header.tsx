'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="border-b sticky top-0 z-50" style={{background:'#FDFAF7', borderColor:'#E8DDD8'}}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">💍</span>
          <span className="font-serif text-xl font-bold" style={{color:'#2C2C3E'}}>Day of Us</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/budget" className="text-sm font-medium" style={{color:'#6B7280'}}>Budget</Link>
          <Link href="/countdown" className="text-sm font-medium" style={{color:'#6B7280'}}>Countdown</Link>
          <Link href="/rsvp" className="text-sm font-medium" style={{color:'#6B7280'}}>RSVP</Link>
          <Link href="/playlist" className="text-sm font-medium" style={{color:'#6B7280'}}>Playlist</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {!loading && (
            user ? (
              <>
                <Link href="/dashboard" className="text-sm font-semibold px-4 py-2 rounded-full" style={{color:'#B07D6E'}}>
                  Dashboard
                </Link>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="text-sm font-semibold px-5 py-2.5 rounded-full" style={{background:'#F5EAE4', color:'#B07D6E'}}>
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold px-4 py-2 rounded-full" style={{color:'#B07D6E'}}>
                  Sign In
                </Link>
                <Link href="/signup" className="text-sm font-semibold px-5 py-2.5 rounded-full" style={{background:'#B07D6E', color:'#ffffff'}}>
                  Start Free
                </Link>
              </>
            )
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="w-6 h-0.5 mb-1.5" style={{background:'#2C2C3E'}}></div>
          <div className="w-6 h-0.5 mb-1.5" style={{background:'#2C2C3E'}}></div>
          <div className="w-6 h-0.5" style={{background:'#2C2C3E'}}></div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t px-6 py-4 flex flex-col gap-4" style={{background:'#FDFAF7', borderColor:'#E8DDD8'}}>
          <Link href="/budget" className="text-sm font-medium" style={{color:'#2C2C3E'}} onClick={() => setMenuOpen(false)}>Budget Calculator</Link>
          <Link href="/countdown" className="text-sm font-medium" style={{color:'#2C2C3E'}} onClick={() => setMenuOpen(false)}>Countdown</Link>
          <Link href="/rsvp" className="text-sm font-medium" style={{color:'#2C2C3E'}} onClick={() => setMenuOpen(false)}>RSVP</Link>
          <Link href="/playlist" className="text-sm font-medium" style={{color:'#2C2C3E'}} onClick={() => setMenuOpen(false)}>Playlist</Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium" style={{color:'#B07D6E'}} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="w-full text-sm font-semibold px-5 py-2.5 rounded-full" style={{background:'#F5EAE4', color:'#B07D6E'}}>Sign Out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium" style={{color:'#B07D6E'}} onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link href="/signup" className="text-sm font-semibold px-5 py-2.5 rounded-full text-center" style={{background:'#B07D6E', color:'#ffffff'}} onClick={() => setMenuOpen(false)}>Start Free</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
