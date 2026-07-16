'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';

interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  collectionName: string;
}

interface SongRequest {
  trackName: string;
  artistName: string;
  artworkUrl: string;
  submitter: string;
}

export default function PlaylistPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [searching, setSearching] = useState(false);
  const [submitter, setSubmitter] = useState('');
  const [songs, setSongs] = useState<SongRequest[]>([]);
  const [added, setAdded] = useState<number | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const search = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=8&entity=song`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    }
    setSearching(false);
  };

  const playPreview = (url: string) => {
    if (audio) { audio.pause(); setAudio(null); setPlaying(null); }
    if (playing === url) return;
    const a = new Audio(url);
    a.play();
    a.onended = () => { setPlaying(null); setAudio(null); };
    setAudio(a);
    setPlaying(url);
  };

  const addSong = (track: Track) => {
    setSongs(prev => [...prev, {
      trackName: track.trackName,
      artistName: track.artistName,
      artworkUrl: track.artworkUrl100,
      submitter: submitter || 'Anonymous',
    }]);
    setAdded(track.trackId);
    setTimeout(() => setAdded(null), 2000);
  };

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>Song Request Playlist</h1>
          <p style={{color:'#6B7280'}}>Search for a song, listen to a preview, and add it to the wedding playlist. Share this page with all your guests.</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6" style={{border:'1px solid #E8DDD8'}}>
          <div className="p-6" style={{background:'linear-gradient(135deg, #2C2C3E, #B07D6E)'}}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background:'rgba(255,255,255,0.15)'}}>🎵</div>
              <span className="font-semibold text-lg" style={{color:'#ffffff'}}>Search for a Song</span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Your Name (optional)</label>
              <input value={submitter} onChange={e => setSubmitter(e.target.value)} placeholder="e.g. Aunt Carol" className="w-full h-12 px-4 rounded-xl outline-none mb-4" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />

              <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Search by song name or artist</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && search()}
                  placeholder="e.g. Dancing Queen, ABBA, Ed Sheeran..."
                  className="flex-1 h-12 px-4 rounded-xl outline-none min-w-0"
                  style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}}
                />
                <button onClick={search} disabled={searching || !query.trim()} className="w-full sm:w-auto px-6 h-12 rounded-xl font-semibold text-sm disabled:opacity-40 flex-shrink-0" style={{background:'#B07D6E', color:'#ffffff'}}>
                  {searching ? '...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-3 mt-4">
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'#6B7280'}}>Results — tap play for a 30-second preview</div>
                {results.map(track => (
                  <div key={track.trackId} className="flex items-center gap-3 p-3 rounded-xl" style={{background:'#F8FAFC', border:'1px solid #E8DDD8'}}>
                    <img src={track.artworkUrl100} alt={track.trackName} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate" style={{color:'#2C2C3E'}}>{track.trackName}</div>
                      <div className="text-xs truncate" style={{color:'#6B7280'}}>{track.artistName} · {track.collectionName}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {track.previewUrl && (
                        <button onClick={() => playPreview(track.previewUrl)} className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors" style={{background: playing === track.previewUrl ? '#B07D6E' : '#F5EAE4', color: playing === track.previewUrl ? '#ffffff' : '#B07D6E'}}>
                          {playing === track.previewUrl ? '⏸' : '▶'}
                        </button>
                      )}
                      <button onClick={() => addSong(track)} className="px-3 h-8 rounded-lg text-xs font-semibold transition-colors" style={{background: added === track.trackId ? '#7A9E8A' : '#B07D6E', color:'#ffffff'}}>
                        {added === track.trackId ? '✓ Added' : '+ Add'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Playlist */}
        {songs.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6" style={{border:'1px solid #E8DDD8'}}>
            <h3 className="font-semibold mb-4" style={{color:'#2C2C3E'}}>Wedding Playlist ({songs.length} songs)</h3>
            <div className="space-y-3">
              {songs.map((s, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{background:'#F5EAE4'}}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0" style={{background:'#B07D6E', color:'#ffffff'}}>{i + 1}</div>
                  <img src={s.artworkUrl} alt={s.trackName} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate" style={{color:'#2C2C3E'}}>{s.trackName}</div>
                    <div className="text-xs" style={{color:'#6B7280'}}>{s.artistName} · Requested by {s.submitter}</div>
                  </div>
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
