'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Wedding {
  id: string;
  partner1_name: string;
  partner2_name: string;
  wedding_date: string | null;
  venue: string | null;
  message: string | null;
  slug: string;
}

interface RSVP {
  id: string;
  guest_name: string;
  attending: string;
  guests: number;
}

interface Song {
  id: string;
  track_name: string;
  artist_name: string;
  artwork_url: string;
  submitter: string;
}

interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  collectionName: string;
}

export default function GuestPage({ wedding, rsvps, songs }: { wedding: Wedding; rsvps: RSVP[]; songs: Song[] }) {
  const [tab, setTab] = useState<'info' | 'rsvp' | 'playlist'>('info');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [guestName, setGuestName] = useState('');
  const [attending, setAttending] = useState('');
  const [guestCount, setGuestCount] = useState('1');
  const [dietary, setDietary] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpDone, setRsvpDone] = useState(false);
  const [rsvpError, setRsvpError] = useState('');

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [searching, setSearching] = useState(false);
  const [submitter, setSubmitter] = useState('');
  const [songList, setSongList] = useState<Song[]>(songs);
  const [added, setAdded] = useState<number | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const coupleName = `${wedding.partner1_name} & ${wedding.partner2_name}`;

  useEffect(() => {
    if (!wedding.wedding_date) return;
    const interval = setInterval(() => {
      const diff = new Date(wedding.wedding_date!).getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [wedding.wedding_date]);

  const submitRSVP = async () => {
    if (!guestName || !attending) { setRsvpError('Please fill in your name and attendance.'); return; }
    setRsvpLoading(true);
    setRsvpError('');
    const supabase = createClient();
    const { error } = await supabase.from('rsvps').insert({
      wedding_id: wedding.id,
      guest_name: guestName,
      attending,
      guests: parseInt(guestCount),
      dietary: dietary || null,
      message: guestMessage || null,
    });
    if (error) { setRsvpError('Something went wrong. Please try again.'); setRsvpLoading(false); return; }
    setRsvpDone(true);
    setRsvpLoading(false);
  };

  const searchSongs = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=8&entity=song`);
      const data = await res.json();
      setResults(data.results || []);
    } catch { setResults([]); }
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

  const addSong = async (track: Track) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('song_requests').insert({
      wedding_id: wedding.id,
      track_name: track.trackName,
      artist_name: track.artistName,
      artwork_url: track.artworkUrl100,
      submitter: submitter || 'Anonymous',
    }).select().single();
    if (!error && data) {
      setSongList(prev => [data, ...prev]);
      setAdded(track.trackId);
      setTimeout(() => setAdded(null), 2000);
    }
  };

  const confirmedCount = rsvps.filter(r => r.attending === 'yes').reduce((sum, r) => sum + (r.guests || 1), 0);

  return (
    <div style={{minHeight:'100vh', background:'#FDFAF7'}}>

      <div className="text-center py-16 px-6" style={{background:'linear-gradient(135deg, #2C2C3E, #B07D6E)'}}>
        <div className="text-4xl mb-4">💍</div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2" style={{color:'#ffffff'}}>{coupleName}</h1>
        {wedding.wedding_date && (
          <p className="text-lg mb-8" style={{color:'rgba(255,255,255,0.75)'}}>
            {new Date(wedding.wedding_date).toLocaleDateString('en-GB', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}
          </p>
        )}
        {wedding.venue && <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.65)'}}>📍 {wedding.venue}</p>}

        {wedding.wedding_date && (
          <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto mb-6">
            {[['Days', timeLeft.days], ['Hours', timeLeft.hours], ['Mins', timeLeft.minutes], ['Secs', timeLeft.seconds]].map(([label, val]) => (
              <div key={label} className="rounded-xl p-3" style={{background:'rgba(255,255,255,0.12)'}}>
                <div className="font-serif text-3xl font-bold" style={{color:'#ffffff'}}>{String(val).padStart(2,'0')}</div>
                <div className="text-xs" style={{color:'rgba(255,255,255,0.6)'}}>{label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-8">
          <div className="text-center">
            <div className="font-bold text-xl" style={{color:'#D4AF7A'}}>{confirmedCount}</div>
            <div className="text-xs" style={{color:'rgba(255,255,255,0.6)'}}>Guests confirmed</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl" style={{color:'#D4AF7A'}}>{songList.length}</div>
            <div className="text-xs" style={{color:'rgba(255,255,255,0.6)'}}>Songs requested</div>
          </div>
        </div>
      </div>

      {wedding.message && (
        <div className="max-w-xl mx-auto px-6 py-8 text-center">
          <p className="font-serif text-lg italic" style={{color:'#6B7280'}}>"{wedding.message}"</p>
          <p className="text-sm mt-2" style={{color:'#B07D6E'}}>— {coupleName}</p>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-6">
        <div className="flex rounded-2xl p-1 mb-8" style={{background:'#F0E8E4'}}>
          {[['info', '📋 Info'], ['rsvp', '✉️ RSVP'], ['playlist', '🎵 Songs']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as any)} className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all" style={{background: tab === key ? '#ffffff' : 'transparent', color: tab === key ? '#B07D6E' : '#6B7280', boxShadow: tab === key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'}}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'info' && (
          <div className="space-y-4 pb-12">
            <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
              <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>Wedding Details</h2>
              <div className="space-y-3">
                {wedding.wedding_date && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📅</span>
                    <div>
                      <div className="text-sm font-medium" style={{color:'#2C2C3E'}}>{new Date(wedding.wedding_date).toLocaleDateString('en-GB', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</div>
                      <div className="text-xs" style={{color:'#6B7280'}}>Wedding Date</div>
                    </div>
                  </div>
                )}
                {wedding.venue && (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📍</span>
                    <div>
                      <div className="text-sm font-medium" style={{color:'#2C2C3E'}}>{wedding.venue}</div>
                      <div className="text-xs" style={{color:'#6B7280'}}>Venue</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
              <h2 className="font-semibold mb-3" style={{color:'#2C2C3E'}}>Let us know you are coming</h2>
              <div className="flex gap-3">
                <button onClick={() => setTab('rsvp')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{background:'#B07D6E', color:'#ffffff'}}>RSVP Now</button>
                <button onClick={() => setTab('playlist')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{background:'#F5EAE4', color:'#B07D6E'}}>Request a Song</button>
              </div>
            </div>
          </div>
        )}

        {tab === 'rsvp' && (
          <div className="pb-12">
            {rsvpDone ? (
              <div className="bg-white rounded-2xl p-8 text-center" style={{border:'1px solid #E8DDD8'}}>
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="font-serif text-2xl font-bold mb-2" style={{color:'#2C2C3E'}}>Thank you, {guestName}!</h2>
                <p style={{color:'#6B7280'}}>{attending === 'yes' ? `We cannot wait to celebrate with you!` : `We are sorry you cannot make it.`}</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
                <h2 className="font-semibold text-lg mb-6" style={{color:'#2C2C3E'}}>Your RSVP</h2>
                {rsvpError && <div className="mb-4 p-3 rounded-xl text-sm" style={{background:'#FEE2E2', color:'#DC2626'}}>{rsvpError}</div>}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Your Full Name</label>
                    <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="e.g. John Smith" className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Will you be attending?</label>
                    <div className="flex gap-3">
                      {[['yes', '✅ Joyfully accepts'], ['no', '❌ Regretfully declines']].map(([val, label]) => (
                        <button key={val} onClick={() => setAttending(val)} className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-colors" style={{background: attending === val ? '#B07D6E' : '#ffffff', borderColor: attending === val ? '#B07D6E' : '#E8DDD8', color: attending === val ? '#ffffff' : '#2C2C3E'}}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {attending === 'yes' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Number of guests including yourself</label>
                        <select value={guestCount} onChange={e => setGuestCount(e.target.value)} className="w-full h-12 px-4 rounded-xl outline-none appearance-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}}>
                          {['1','2','3','4'].map(n => <option key={n} value={n}>{n} {n === '1' ? 'guest' : 'guests'}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Dietary requirements (optional)</label>
                        <input value={dietary} onChange={e => setDietary(e.target.value)} placeholder="e.g. vegetarian, nut allergy..." className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Message to the couple (optional)</label>
                    <textarea value={guestMessage} onChange={e => setGuestMessage(e.target.value)} placeholder="Share your well wishes..." rows={3} className="w-full px-4 py-3 rounded-xl outline-none resize-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
                  </div>
                  <button onClick={submitRSVP} disabled={!guestName || !attending || rsvpLoading} className="w-full font-semibold py-3.5 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2" style={{background:'#B07D6E', color:'#ffffff'}}>
                    {rsvpLoading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Submitting...</> : 'Submit RSVP 💍'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'playlist' && (
          <div className="pb-12 space-y-4">
            <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
              <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>Request a Song</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Your name (optional)</label>
                  <input value={submitter} onChange={e => setSubmitter(e.target.value)} placeholder="e.g. Aunt Carol" className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Search for a song</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchSongs()} placeholder="Song name or artist..." className="flex-1 h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
                    <button onClick={searchSongs} disabled={searching || !query.trim()} className="w-full sm:w-auto px-6 h-12 rounded-xl font-semibold text-sm disabled:opacity-40" style={{background:'#B07D6E', color:'#ffffff'}}>
                      {searching ? '...' : 'Search'}
                    </button>
                  </div>
                </div>
              </div>

              {results.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider" style={{color:'#6B7280'}}>Tap play for a preview</div>
                  {results.map(track => (
                    <div key={track.trackId} className="flex items-center gap-3 p-3 rounded-xl" style={{background:'#F8FAFC', border:'1px solid #E8DDD8'}}>
                      <img src={track.artworkUrl100} alt={track.trackName} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate" style={{color:'#2C2C3E'}}>{track.trackName}</div>
                        <div className="text-xs truncate" style={{color:'#6B7280'}}>{track.artistName}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {track.previewUrl && (
                          <button onClick={() => playPreview(track.previewUrl)} className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{background: playing === track.previewUrl ? '#B07D6E' : '#F5EAE4', color: playing === track.previewUrl ? '#ffffff' : '#B07D6E'}}>
                            {playing === track.previewUrl ? '⏸' : '▶'}
                          </button>
                        )}
                        <button onClick={() => addSong(track)} className="px-3 h-8 rounded-lg text-xs font-semibold" style={{background: added === track.trackId ? '#7A9E8A' : '#B07D6E', color:'#ffffff'}}>
                          {added === track.trackId ? '✓ Added' : '+ Add'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {songList.length > 0 && (
              <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
                <h3 className="font-semibold mb-4" style={{color:'#2C2C3E'}}>Wedding Playlist ({songList.length} songs)</h3>
                <div className="space-y-3">
                  {songList.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl" style={{background:'#F5EAE4'}}>
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0" style={{background:'#B07D6E', color:'#ffffff'}}>{i + 1}</div>
                      {s.artwork_url && <img src={s.artwork_url} alt={s.track_name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate" style={{color:'#2C2C3E'}}>{s.track_name}</div>
                        <div className="text-xs" style={{color:'#6B7280'}}>{s.artist_name} · {s.submitter}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-center py-8 px-6" style={{borderTop:'1px solid #E8DDD8'}}>
        <Link href="/" className="text-sm" style={{color:'#B07D6E'}}>
          💍 Create your own wedding page at <strong>Day of Us</strong>
        </Link>
      </div>
    </div>
  );
            }
