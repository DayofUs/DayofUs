'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-cream border-b border-[#E8DDD8] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">💍</span>
          <div>
            <span className="font-serif text-xl font-bold text-navy">Day of Us</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/budget" className="text-sm font-medium text-[#6B7280] hover:text-[#B07D6E] transition-colors">Budget Calculator</Link>
          <Link href="/countdown" className="text-sm font-medium text-[#6B7280] hover:text-[#B07D6E] transition-colors">Countdown</Link>
          <Link href="/rsvp" className="text-sm font-medium text-[#6B7280] hover:text-[#B07D6E] transition-colors">RSVP</Link>
          <Link href="/playlist" className="text-sm font-medium text-[#6B7280] hover:text-[#B07D6E] transition-colors">Playlist</Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/budget"
            className="bg-[#B07D6E] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#8B5E52] transition-colors"
          >
            Start Planning Free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-navy p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="w-6 h-0.5 bg-navy mb-1.5"></div>
          <div className="w-6 h-0.5 bg-navy mb-1.5"></div>
          <div className="w-6 h-0.5 bg-navy"></div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-[#E8DDD8] px-6 py-4 flex flex-col gap-4">
          <Link href="/budget" className="text-sm font-medium text-navy" onClick={() => setMenuOpen(false)}>Budget Calculator</Link>
          <Link href="/countdown" className="text-sm font-medium text-navy" onClick={() => setMenuOpen(false)}>Countdown</Link>
          <Link href="/rsvp" className="text-sm font-medium text-navy" onClick={() => setMenuOpen(false)}>RSVP</Link>
          <Link href="/playlist" className="text-sm font-medium text-navy" onClick={() => setMenuOpen(false)}>Playlist</Link>
          <Link href="/budget" className="bg-[#B07D6E] text-white text-sm font-semibold px-5 py-2.5 rounded-full text-center" onClick={() => setMenuOpen(false)}>Start Planning Free</Link>
        </div>
      )}
    </header>
  );
}
