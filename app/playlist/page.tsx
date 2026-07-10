'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

export default function PlaylistPage() {
  const [songs, setSongs] = useState<{ name: string; artist: string; submitter: string }[]>([]);
  const [songName, setSongName] = useState('');
  const [artist, setArtist] = useState('');
  const [submitter, setSubmitter] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const addSong = () => {
    if (!songName || !artist) return;
    setSongs(prev => [...prev, { name: songName, artist, submitter: submitter || 'Anonymous' }]);
    setSongName(''); setArtist(''); setSubmitter('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-navy mb-4">Song Request Playlist</h1>
          <p className="text-[#6B7280]">Let your guests request songs for the big day. Share this page with everyone on the guest list.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DDD8] shadow-sm overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-[#2C2C3E] to-[#B07D6E] p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center text-xl">🎵</div>
              <span className="font-semibold text-white text-lg">Request a Song</span>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-2">Song Name</label>
                <input value={songName} onChange={e => setSongName(e.target.value)} placeholder="e.g. Dancing Queen" className="w-full h-12 border border-[#E8DDD8] rounded-xl bg-[#F8FAFC] px-4 text-navy outline-none focus:border-[#B07D6E]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-2">Artist</label>
                <input value={artist} onChange={e => setArtist(e.target.value)} placeholder="e.g. ABBA" className="w-full h-12 border border-[#E8DDD8] rounded-xl bg-[#F8FAFC] px-4 text-navy outline-none focus:border-[#B07D6E]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-2">Your Name (optional)</label>
                <input value={submitter} onChange={e => setSubmitter(e.target.value)} placeholder="e.g. Aunt Carol" className="w-full h-12 border border-[#E8DDD8] rounded-xl bg-[#F8FAFC] px-4 text-navy outline-none focus:border-[#B07D6E]" />
              </div>
            </div>

            {submitted && <div className="bg-[#E8F0EC] text-[#7A9E8A] font-semibold text-sm p-3 rounded-xl mb-4 text-center">✅ Song added! Keep the requests coming.</div>}

            <button onClick={addSong} disabled={!songName || !artist} className="w-full bg-[#B07D6E] text-white font-semibold py-3 rounded-xl hover:bg-[#8B5E52] transition-colors disabled:opacity-40">
              Add Song Request 🎵
            </button>
          </div>
        </div>

        {songs.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E8DDD8] shadow-sm p-6">
            <h3 className="font-semibold text-navy mb-4">Song Requests ({songs.length})</h3>
            <div className="space-y-3">
              {songs.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-[#F5EAE4] rounded-xl">
                  <div className="w-8 h-8 bg-[#B07D6E] rounded-lg flex items-center justify-center text-white font-bold text-sm">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-navy text-sm">{s.name}</div>
                    <div className="text-xs text-[#6B7280]">{s.artist} · Requested by {s.submitter}</div>
                  </div>
                  <span className="text-lg">🎵</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
