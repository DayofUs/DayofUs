'use client';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import PhotoGallery from '@/components/PhotoGallery';
import jsPDF from 'jspdf';

interface Wedding {
  id: string;
  partner1_name: string;
  partner2_name: string;
  wedding_date: string | null;
  total_budget: number | null;
  currency: string;
  slug: string | null;
  venue: string | null;
  message: string | null;
  is_premium?: boolean | null;
}

interface User {
  id: string;
  email?: string;
}

interface RSVP {
  id: string;
  guest_name: string;
  attending: string;
  guests: number;
  dietary: string | null;
  message: string | null;
}

interface Song {
  id: string;
  track_name: string;
  artist_name: string;
  artwork_url: string | null;
  submitter: string | null;
}

interface Photo {
  id: string;
  photo_url: string;
  uploaded_by: string | null;
}

interface Wish {
  id: string;
  guest_name: string;
  message: string;
}

export default function DashboardClient({ user, wedding, rsvps, songs, photos = [], wishes = [] }: {
  user: User;
  wedding: Wedding | null;
  rsvps: RSVP[];
  songs: Song[];
  photos?: Photo[];
  wishes?: Wish[];
}) {
  const [weddingDate, setWeddingDate] = useState(wedding?.wedding_date || '');
  const [venue, setVenue] = useState(wedding?.venue || '');
  const [message, setMessage] = useState(wedding?.message || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedUpload, setCopiedUpload] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [customSlug, setCustomSlug] = useState(wedding?.slug || '');
  const [slugSaving, setSlugSaving] = useState(false);
  const [slugSaved, setSlugSaved] = useState(false);
  const [slugError, setSlugError] = useState('');
  const router = useRouter();

  const coupleName = wedding ? `${wedding.partner1_name} & ${wedding.partner2_name}` : 'Your Wedding';
  const guestLink = wedding?.slug ? `https://dayofus.org/w/${wedding.slug}` : null;
  const uploadLink = wedding?.slug ? `https://dayofus.org/upload/${wedding.slug}` : null;
  const qrUrl = uploadLink ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(uploadLink)}` : null;
  const confirmedGuests = rsvps.filter(r => r.attending === 'yes').reduce((sum, r) => sum + (r.guests || 1), 0);
  const declinedGuests = rsvps.filter(r => r.attending === 'no');
  const daysUntil = weddingDate ? Math.ceil((new Date(weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  const saveDetails = async () => {
    if (!wedding) return;
    setSaving(true);
    const supabase = createClient();
    await supabase.from('weddings').update({
      wedding_date: weddingDate || null,
      venue: venue || null,
      message: message || null,
    }).eq('id', wedding.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); router.refresh(); }, 2000);
  };

  const copyLink = () => {
    if (!guestLink) return;
    navigator.clipboard.writeText(guestLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyUploadLink = () => {
    if (!uploadLink) return;
    navigator.clipboard.writeText(uploadLink);
    setCopiedUpload(true);
    setTimeout(() => setCopiedUpload(false), 2000);
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch('/api/create-checkout-session', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setUpgrading(false);
      }
    } catch {
      setUpgrading(false);
    }
  };

  const RESERVED_SLUGS = ['login', 'signup', 'dashboard', 'budget', 'countdown', 'rsvp', 'playlist', 'upload', 'privacy', 'contact', 'api', 'w', 'auth', 'checklist', 'venue'];

  const saveSlug = async () => {
    if (!wedding) return;
    const cleaned = customSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

    if (!cleaned) { setSlugError('Please enter a link.'); return; }
    if (cleaned.length < 3) { setSlugError('Your link must be at least 3 characters.'); return; }
    if (RESERVED_SLUGS.includes(cleaned)) { setSlugError('This link is reserved. Please choose another.'); return; }

    setSlugSaving(true);
    setSlugError('');
    const supabase = createClient();

    if (cleaned !== wedding.slug) {
      const { data: existing } = await supabase
        .from('weddings')
        .select('id')
        .eq('slug', cleaned)
        .neq('id', wedding.id)
        .maybeSingle();

      if (existing) {
        setSlugError('This link is already taken. Please choose another.');
        setSlugSaving(false);
        return;
      }
    }

    const { error } = await supabase.from('weddings').update({ slug: cleaned }).eq('id', wedding.id);
    if (error) {
      setSlugError('Something went wrong. Please try again.');
      setSlugSaving(false);
      return;
    }

    setCustomSlug(cleaned);
    setSlugSaving(false);
    setSlugSaved(true);
    setTimeout(() => { setSlugSaved(false); router.refresh(); }, 1500);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 22;

    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(44, 44, 62);
    doc.text(coupleName, pageWidth / 2, y, { align: 'center' });
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(107, 114, 128);
    doc.text('Guest List & Playlist', pageWidth / 2, y, { align: 'center' });
    y += 10;

    doc.setDrawColor(232, 221, 216);
    doc.line(20, y, pageWidth - 20, y);
    y += 12;

    const attending = rsvps.filter(r => r.attending === 'yes');
    const declined = rsvps.filter(r => r.attending === 'no');

    doc.setFont('times', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(44, 44, 62);
    doc.text(`Guest List (${confirmedGuests} confirmed)`, 20, y);
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    if (attending.length === 0) {
      doc.setTextColor(107, 114, 128);
      doc.text('No confirmed guests yet.', 20, y);
      y += 7;
    } else {
      attending.forEach(r => {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.setTextColor(44, 44, 62);
        doc.text(`${r.guest_name}  —  ${r.guests} guest${r.guests === 1 ? '' : 's'}`, 20, y);
        y += 6;
        if (r.dietary) {
          doc.setFontSize(9);
          doc.setTextColor(107, 114, 128);
          doc.text(`Dietary: ${r.dietary}`, 24, y);
          doc.setFontSize(10);
          y += 6;
        }
      });
    }

    if (declined.length > 0) {
      y += 5;
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 44, 62);
      doc.text(`Declined (${declined.length})`, 20, y);
      doc.setFont('helvetica', 'normal');
      y += 7;
      declined.forEach(r => {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.setTextColor(107, 114, 128);
        doc.text(r.guest_name, 20, y);
        y += 6;
      });
    }

    y += 8;
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setDrawColor(232, 221, 216);
    doc.line(20, y, pageWidth - 20, y);
    y += 10;

    doc.setFont('times', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(44, 44, 62);
    doc.text(`Playlist (${songs.length} songs)`, 20, y);
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if (songs.length === 0) {
      doc.setTextColor(107, 114, 128);
      doc.text('No song requests yet.', 20, y);
    } else {
      songs.forEach((s, i) => {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.setTextColor(44, 44, 62);
        doc.text(`${i + 1}. ${s.track_name} — ${s.artist_name}`, 20, y);
        y += 6;
      });
    }

    doc.save(`${wedding?.slug || 'wedding'}-guest-list-and-playlist.pdf`);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-8">
        <div className="text-sm font-semibold uppercase tracking-wider mb-2" style={{color:'#B07D6E'}}>Your Wedding Dashboard</div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold" style={{color:'#2C2C3E'}}>{coupleName} 💍</h1>
      </div>

      {/* Share link */}
      {guestLink && (
        <div className="mb-8 rounded-2xl p-6" style={{background:'linear-gradient(135deg, #2C2C3E, #B07D6E)'}}>
          <div className="text-sm font-semibold uppercase tracking-wider mb-1" style={{color:'rgba(255,255,255,0.6)'}}>Your Guest Page</div>
          <p className="text-sm mb-4" style={{color:'rgba(255,255,255,0.8)'}}>Share this link with your guests to collect RSVPs and song requests</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 px-4 py-3 rounded-xl text-sm font-medium truncate" style={{background:'rgba(255,255,255,0.15)', color:'#ffffff'}}>
              {guestLink}
            </div>
            <button onClick={copyLink} className="px-5 py-3 rounded-xl text-sm font-semibold flex-shrink-0" style={{background:'#ffffff', color:'#B07D6E'}}>
              {copied ? '✓ Copied!' : 'Copy Link'}
            </button>
          </div>
          <Link href={`/w/${wedding?.slug}`} target="_blank" className="inline-block mt-3 text-xs" style={{color:'rgba(255,255,255,0.6)'}}>
            Preview your guest page →
          </Link>

          <div className="mt-5 pt-5" style={{borderTop:'1px solid rgba(255,255,255,0.15)'}}>
            {wedding?.is_premium ? (
              <>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'rgba(255,255,255,0.6)'}}>Customize Your Link</div>
                {slugError && <div className="mb-2 p-2 rounded-lg text-xs" style={{background:'rgba(220,38,38,0.2)', color:'#ffffff'}}>{slugError}</div>}
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center rounded-xl overflow-hidden" style={{background:'rgba(255,255,255,0.15)'}}>
                    <span className="pl-4 text-xs" style={{color:'rgba(255,255,255,0.5)'}}>dayofus.org/w/</span>
                    <input
                      value={customSlug}
                      onChange={e => setCustomSlug(e.target.value)}
                      className="flex-1 bg-transparent py-3 pr-3 text-sm font-medium outline-none min-w-0"
                      style={{color:'#ffffff'}}
                    />
                  </div>
                  <button
                    onClick={saveSlug}
                    disabled={slugSaving || customSlug === wedding?.slug}
                    className="px-5 py-3 rounded-xl text-sm font-semibold flex-shrink-0 disabled:opacity-40"
                    style={{background:'#ffffff', color:'#B07D6E'}}
                  >
                    {slugSaved ? '✓ Saved!' : slugSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs" style={{color:'rgba(255,255,255,0.7)'}}>Want a custom link like dayofus.org/w/yourname? Unlock it with Premium.</p>
                <button
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold flex-shrink-0 disabled:opacity-40"
                  style={{background:'#ffffff', color:'#B07D6E'}}
                >
                  {upgrading ? 'Redirecting...' : 'Upgrade to Premium'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Days to go', value: daysUntil !== null && daysUntil > 0 ? daysUntil.toLocaleString() : '—' },
          { label: 'Guests confirmed', value: `${confirmedGuests}${!wedding?.is_premium ? '/75' : ''}` },
          { label: 'Song requests', value: songs.length.toString() },
          { label: 'RSVPs received', value: rsvps.length.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl p-4 text-center" style={{border:'1px solid #E8DDD8'}}>
            <div className="font-serif text-2xl font-bold mb-1" style={{color:'#2C2C3E'}}>{value}</div>
            <div className="text-xs" style={{color:'#6B7280'}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Photo Gallery */}
      {wedding?.slug && (
        <div className="bg-white rounded-2xl p-6 mb-8" style={{border:'1px solid #E8DDD8'}}>
          <h2 className="font-semibold text-lg mb-1" style={{color:'#2C2C3E'}}>
            📸 Photo Gallery ({photos.length}{!wedding.is_premium ? '/30' : ''})
          </h2>
          <p className="text-sm mb-4" style={{color:'#6B7280'}}>
            Guests scan this code at your wedding to upload photos straight from their phone — no app needed.
          </p>
          {!wedding.is_premium && (
            <div className="mb-6 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{background:'#F5EAE4'}}>
              <div>
                <div className="text-sm font-semibold" style={{color:'#2C2C3E'}}>Unlock unlimited photos</div>
                <div className="text-xs" style={{color:'#6B7280'}}>Plus custom slug, unlimited guests, wishes wall & PDF export — one-time $19</div>
              </div>
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-40 flex-shrink-0"
                style={{background:'#B07D6E', color:'#ffffff'}}
              >
                {upgrading ? 'Redirecting...' : 'Upgrade to Premium'}
              </button>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
            {qrUrl && (
              <img src={qrUrl} alt="QR code for photo upload" className="rounded-xl flex-shrink-0" style={{border:'1px solid #E8DDD8', width:160, height:160}} />
            )}
            <div className="flex-1 w-full">
              <div className="px-4 py-3 rounded-xl text-sm font-medium truncate mb-3" style={{background:'#F8FAFC', border:'1px solid #E8DDD8', color:'#2C2C3E'}}>
                {uploadLink}
              </div>
              <button onClick={copyUploadLink} className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold" style={{background:'#B07D6E', color:'#ffffff'}}>
                {copiedUpload ? '✓ Copied!' : 'Copy Upload Link'}
              </button>
              <p className="text-xs mt-2" style={{color:'#6B7280'}}>Tip: print the QR code and place it on tables at your reception.</p>
            </div>
          </div>
          {photos.length === 0 ? (
            <p className="text-sm" style={{color:'#6B7280'}}>No photos yet — share the QR code at your wedding to start collecting memories.</p>
          ) : (
            <PhotoGallery photos={photos} />
          )}
        </div>
      )}

      {/* Wedding details */}
      <div className="bg-white rounded-2xl p-6 mb-8" style={{border:'1px solid #E8DDD8'}}>
        <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>Wedding Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Wedding Date</label>
              <input type="date" value={weddingDate} onChange={e => setWeddingDate(e.target.value)} className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Venue (optional)</label>
              <input value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. The Grand Hotel" className="w-full h-12 px-4 rounded-xl outline-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Message to guests</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="e.g. We are so excited to celebrate with you all..." rows={3} className="w-full px-4 py-3 rounded-xl outline-none resize-none" style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}} />
          </div>
          <button onClick={saveDetails} disabled={saving} className="w-full font-semibold py-3 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2" style={{background: saved ? '#7A9E8A' : '#B07D6E', color:'#ffffff'}}>
            {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save Details'}
          </button>
        </div>
      </div>

      {/* RSVPs */}
      <div className="bg-white rounded-2xl p-6 mb-8" style={{border:'1px solid #E8DDD8'}}>
        <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>
          Guest RSVPs ({rsvps.length})
        </h2>
        {!wedding?.is_premium && confirmedGuests >= 75 && (
          <div className="mb-4 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{background:'#FEF3C7'}}>
            <div>
              <div className="text-sm font-semibold" style={{color:'#92400E'}}>You've reached your free guest limit (75)</div>
              <div className="text-xs" style={{color:'#92400E'}}>New guests can still decline, but accepted RSVPs are capped until you upgrade</div>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-40 flex-shrink-0"
              style={{background:'#B07D6E', color:'#ffffff'}}
            >
              {upgrading ? 'Redirecting...' : 'Upgrade to Premium'}
            </button>
          </div>
        )}
        {rsvps.length === 0 ? (
          <p className="text-sm" style={{color:'#6B7280'}}>No RSVPs yet — share your guest link above to start collecting responses.</p>
        ) : (
          <>
            {rsvps.filter(r => r.attending === 'yes').length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'#7A9E8A'}}>✅ Attending ({confirmedGuests} guests)</div>
                <div className="space-y-2">
                  {rsvps.filter(r => r.attending === 'yes').map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-xl" style={{background:'#F0FDF4', border:'1px solid #BBF7D0'}}>
                      <div>
                        <div className="font-medium text-sm" style={{color:'#2C2C3E'}}>{r.guest_name}</div>
                        {r.dietary && <div className="text-xs" style={{color:'#6B7280'}}>Dietary: {r.dietary}</div>}
                        {r.message && <div className="text-xs italic mt-1" style={{color:'#6B7280'}}>"{r.message}"</div>}
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{background:'#DCFCE7', color:'#16A34A'}}>{r.guests} {r.guests === 1 ? 'guest' : 'guests'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {declinedGuests.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{color:'#DC2626'}}>❌ Declining ({declinedGuests.length})</div>
                <div className="space-y-2">
                  {declinedGuests.map(r => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-xl" style={{background:'#FEF2F2', border:'1px solid #FECACA'}}>
                      <div>
                        <div className="font-medium text-sm" style={{color:'#2C2C3E'}}>{r.guest_name}</div>
                        {r.message && <div className="text-xs italic mt-1" style={{color:'#6B7280'}}>"{r.message}"</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Songs */}
      <div className="bg-white rounded-2xl p-6 mb-8" style={{border:'1px solid #E8DDD8'}}>
        <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>Song Requests ({songs.length})</h2>
        {songs.length === 0 ? (
          <p className="text-sm" style={{color:'#6B7280'}}>No song requests yet — guests can add songs from your guest page.</p>
        ) : (
          <div className="space-y-2">
            {songs.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl" style={{background:'#F8FAFC', border:'1px solid #E8DDD8'}}>
                <span className="text-sm font-bold w-6 text-center flex-shrink-0" style={{color:'#B07D6E'}}>{i + 1}</span>
                {s.artwork_url && <img src={s.artwork_url} alt={s.track_name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate" style={{color:'#2C2C3E'}}>{s.track_name}</div>
                  <div className="text-xs" style={{color:'#6B7280'}}>{s.artist_name}{s.submitter ? ` · ${s.submitter}` : ''}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wishes Wall */}
      <div className="bg-white rounded-2xl p-6 mb-8" style={{border:'1px solid #E8DDD8'}}>
        <h2 className="font-semibold text-lg mb-1" style={{color:'#2C2C3E'}}>💌 Wishes Wall ({wishes.length})</h2>
        {!wedding?.is_premium ? (
          <>
            <p className="text-sm mb-4" style={{color:'#6B7280'}}>Let guests leave heartfelt messages for you both — unlock this with Premium.</p>
            <div className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{background:'#F5EAE4'}}>
              <div>
                <div className="text-sm font-semibold" style={{color:'#2C2C3E'}}>Unlock the Wishes Wall</div>
                <div className="text-xs" style={{color:'#6B7280'}}>Plus unlimited photos, custom slug, unlimited guests & PDF export — one-time $19</div>
              </div>
              <button
                onClick={handleUpgrade}
                disabled={upgrading}
                className="font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-40 flex-shrink-0"
                style={{background:'#B07D6E', color:'#ffffff'}}
              >
                {upgrading ? 'Redirecting...' : 'Upgrade to Premium'}
              </button>
            </div>
          </>
        ) : wishes.length === 0 ? (
          <p className="text-sm" style={{color:'#6B7280'}}>No wishes yet — guests can leave one from your guest page.</p>
        ) : (
          <div className="space-y-3 mt-4">
            {wishes.map(w => (
              <div key={w.id} className="p-4 rounded-xl" style={{background:'#F5EAE4'}}>
                <p className="text-sm italic mb-2" style={{color:'#2C2C3E'}}>"{w.message}"</p>
                <p className="text-xs font-semibold" style={{color:'#B07D6E'}}>— {w.guest_name}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Budget tool */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>Planning Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: '💰', title: 'Budget Planner', desc: 'Track your wedding spend by category', href: '/budget', color: '#F5EAE4' },
            { icon: '📅', title: 'Countdown', desc: 'Live countdown to your wedding day', href: '/countdown', color: '#F5E6C8' },
          ].map(t => (
            <Link key={t.title} href={t.href} className="bg-white rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-all" style={{border:'1px solid #E8DDD8'}}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background:t.color}}>{t.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold" style={{color:'#2C2C3E'}}>{t.title}</div>
                <div className="text-sm" style={{color:'#6B7280'}}>{t.desc}</div>
              </div>
              <div style={{color:'#B07D6E'}}>→</div>
            </Link>
          ))}
        </div>
      </div>

      {/* PDF Export */}
      <div className="bg-white rounded-2xl p-6 mb-8" style={{border:'1px solid #E8DDD8'}}>
        <h2 className="font-semibold text-lg mb-1" style={{color:'#2C2C3E'}}>📄 Export Guest List & Playlist</h2>
        {wedding?.is_premium ? (
          <>
            <p className="text-sm mb-4" style={{color:'#6B7280'}}>Download a printable PDF of your confirmed guests, dietary needs, and requested songs.</p>
            <button onClick={exportPDF} className="font-semibold px-5 py-2.5 rounded-xl text-sm" style={{background:'#B07D6E', color:'#ffffff'}}>
              Download PDF
            </button>
          </>
        ) : (
          <div className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{background:'#F5EAE4'}}>
            <div>
              <div className="text-sm font-semibold" style={{color:'#2C2C3E'}}>Export your guest list & playlist as a PDF</div>
              <div className="text-xs" style={{color:'#6B7280'}}>Plus unlimited photos, wishes wall, custom slug & unlimited guests — one-time $19</div>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={upgrading}
              className="font-semibold px-5 py-2.5 rounded-xl text-sm disabled:opacity-40 flex-shrink-0"
              style={{background:'#B07D6E', color:'#ffffff'}}
            >
              {upgrading ? 'Redirecting...' : 'Upgrade to Premium'}
            </button>
          </div>
        )}
      </div>

      {/* Account */}
      <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
        <h2 className="font-semibold mb-3" style={{color:'#2C2C3E'}}>Account</h2>
        <p className="text-sm mb-4" style={{color:'#6B7280'}}>Signed in as <strong style={{color:'#2C2C3E'}}>{user.email}</strong></p>
        <form action="/auth/signout" method="post">
          <button type="submit" className="text-sm font-semibold px-4 py-2 rounded-xl" style={{background:'#F5EAE4', color:'#B07D6E'}}>Sign Out</button>
        </form>
      </div>

    </main>
  );
}
