'use client';
import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import PhotoGallery from '@/components/PhotoGallery';
import jsPDF from 'jspdf';
import { THEMES } from '@/lib/themes';

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
  meal_options?: string[] | null;
  theme?: string | null;
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
  meal_choice: string | null;
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
  media_type?: string | null;
}

interface Wish {
  id: string;
  guest_name: string;
  message: string;
}

interface Budget {
  currency: string;
  total_budget: number | null;
  guest_count: number | null;
  allocations: Record<string, string> | null;
}

interface Checklist {
  checked_items: Record<string, boolean> | null;
  custom_items: { id: string; text: string }[] | null;
}

interface Venue {
  name: string;
  hireCost: string;
  perHead: string;
  guestCount: string;
  extras: string;
}

interface VenueComparison {
  venues: Venue[] | null;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface PartyMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
}

interface RegistryLink {
  id: string;
  label: string;
  url: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', GBP: '£', EUR: '€', AUD: 'A$', CAD: 'C$',
  NZD: 'NZ$', SGD: 'S$', ZAR: 'R', INR: '₹', AED: 'AED',
};

const TOTAL_CHECKLIST_ITEMS = 32;

export default function DashboardClient({ user, wedding, rsvps, songs, photos = [], wishes = [], budget = null, checklist = null, venueComparison = null, faqs = [], weddingParty = [], registryLinks = [] }: {
  user: User;
  wedding: Wedding | null;
  rsvps: RSVP[];
  songs: Song[];
  photos?: Photo[];
  wishes?: Wish[];
  budget?: Budget | null;
  checklist?: Checklist | null;
  venueComparison?: VenueComparison | null;
  faqs?: FAQ[];
  weddingParty?: PartyMember[];
  registryLinks?: RegistryLink[];
}) {
  const [weddingDate, setWeddingDate] = useState(wedding?.wedding_date || '');
  const [venue, setVenue] = useState(wedding?.venue || '');
  const [message, setMessage] = useState(wedding?.message || '');
  const [mealOptions, setMealOptions] = useState<string[]>(wedding?.meal_options || []);
  const [newMealOption, setNewMealOption] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedUpload, setCopiedUpload] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [customSlug, setCustomSlug] = useState(wedding?.slug || '');
  const [slugSaving, setSlugSaving] = useState(false);
  const [slugSaved, setSlugSaved] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [faqList, setFaqList] = useState<FAQ[]>(faqs);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [addingFaq, setAddingFaq] = useState(false);
  const [partyList, setPartyList] = useState<PartyMember[]>(weddingParty);
  const [newPartyName, setNewPartyName] = useState('');
  const [newPartyRole, setNewPartyRole] = useState('');
  const [newPartyBio, setNewPartyBio] = useState('');
  const [newPartyPhoto, setNewPartyPhoto] = useState<File | null>(null);
  const [newPartyPhotoPreview, setNewPartyPhotoPreview] = useState<string | null>(null);
  const [addingParty, setAddingParty] = useState(false);
  const [registryList, setRegistryList] = useState<RegistryLink[]>(registryLinks);
  const [newRegistryLabel, setNewRegistryLabel] = useState('');
  const [newRegistryUrl, setNewRegistryUrl] = useState('');
  const [addingRegistry, setAddingRegistry] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(wedding?.theme || 'rose');
  const [savingTheme, setSavingTheme] = useState(false);
  const [themeSaved, setThemeSaved] = useState(false);
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
      meal_options: mealOptions,
    }).eq('id', wedding.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); router.refresh(); }, 2000);
  };

  const addMealOption = () => {
    if (!newMealOption.trim() || mealOptions.includes(newMealOption.trim())) return;
    setMealOptions(prev => [...prev, newMealOption.trim()]);
    setNewMealOption('');
  };

  const removeMealOption = (option: string) => {
    setMealOptions(prev => prev.filter(o => o !== option));
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

  const addFaq = async () => {
    if (!wedding || !newQuestion.trim() || !newAnswer.trim()) return;
    setAddingFaq(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('wedding_faqs').insert({
      wedding_id: wedding.id,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
    }).select().single();
    if (!error && data) {
      setFaqList(prev => [...prev, data]);
      setNewQuestion('');
      setNewAnswer('');
    }
    setAddingFaq(false);
  };

  const removeFaq = async (id: string) => {
    const supabase = createClient();
    await supabase.from('wedding_faqs').delete().eq('id', id);
    setFaqList(prev => prev.filter(f => f.id !== id));
  };

  const handlePartyPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewPartyPhoto(file);
    setNewPartyPhotoPreview(URL.createObjectURL(file));
  };

  const addPartyMember = async () => {
    if (!wedding || !newPartyName.trim() || !newPartyRole.trim()) return;
    setAddingParty(true);
    const supabase = createClient();

    let photoUrl: string | null = null;
    if (newPartyPhoto) {
      const fileExt = newPartyPhoto.name.split('.').pop();
      const filePath = `party/${wedding.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('wedding-photos').upload(filePath, newPartyPhoto);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('wedding-photos').getPublicUrl(filePath);
        photoUrl = urlData.publicUrl;
      }
    }

    const { data, error } = await supabase.from('wedding_party').insert({
      wedding_id: wedding.id,
      name: newPartyName.trim(),
      role: newPartyRole.trim(),
      bio: newPartyBio.trim() || null,
      photo_url: photoUrl,
    }).select().single();

    if (!error && data) {
      setPartyList(prev => [...prev, data]);
      setNewPartyName('');
      setNewPartyRole('');
      setNewPartyBio('');
      setNewPartyPhoto(null);
      setNewPartyPhotoPreview(null);
    }
    setAddingParty(false);
  };

  const removePartyMember = async (id: string) => {
    const supabase = createClient();
    await supabase.from('wedding_party').delete().eq('id', id);
    setPartyList(prev => prev.filter(p => p.id !== id));
  };

  const addRegistryLink = async () => {
    if (!wedding || !newRegistryLabel.trim() || !newRegistryUrl.trim()) return;
    let url = newRegistryUrl.trim();
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

    setAddingRegistry(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('wedding_registry_links').insert({
      wedding_id: wedding.id,
      label: newRegistryLabel.trim(),
      url,
    }).select().single();

    if (!error && data) {
      setRegistryList(prev => [...prev, data]);
      setNewRegistryLabel('');
      setNewRegistryUrl('');
    }
    setAddingRegistry(false);
  };

  const removeRegistryLink = async (id: string) => {
    const supabase = createClient();
    await supabase.from('wedding_registry_links').delete().eq('id', id);
    setRegistryList(prev => prev.filter(r => r.id !== id));
  };

  const saveTheme = async (themeKey: string) => {
    if (!wedding) return;
    setSelectedTheme(themeKey);
    setSavingTheme(true);
    const supabase = createClient();
    const { error } = await supabase.from('weddings').update({ theme: themeKey }).eq('id', wedding.id);
    setSavingTheme(false);
    if (!error) {
      setThemeSaved(true);
      setTimeout(() => setThemeSaved(false), 2000);
    }
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
        if (r.meal_choice) {
          doc.setFontSize(9);
          doc.setTextColor(107, 114, 128);
          doc.text(`Meal: ${r.meal_choice}`, 24, y);
          doc.setFontSize(10);
          y += 6;
        }
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

      {/* Guest Page Theme */}
      <div className="bg-white rounded-2xl p-6 mb-8" style={{border:'1px solid #E8DDD8'}}>
        <h2 className="font-semibold text-lg mb-1" style={{color:'#2C2C3E'}}>🎨 Guest Page Theme</h2>
        <p className="text-sm mb-4" style={{color:'#6B7280'}}>Choose a color palette for your guest page.</p>

        {!wedding?.is_premium ? (
          <div className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{background:'#F5EAE4'}}>
            <div>
              <div className="text-sm font-semibold" style={{color:'#2C2C3E'}}>Unlock More Themes</div>
              <div className="text-xs" style={{color:'#6B7280'}}>Plus unlimited photos, wishes wall, custom slug & more — one-time $19</div>
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
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.values(THEMES).map(theme => (
              <button
                key={theme.key}
                onClick={() => saveTheme(theme.key)}
                disabled={savingTheme}
                className="p-3 rounded-xl border-2 text-left transition-all"
                style={{borderColor: selectedTheme === theme.key ? theme.primary : '#E8DDD8', background: selectedTheme === theme.key ? theme.blush : '#FFFFFF'}}
              >
                <div className="flex gap-1 mb-2">
                  <div className="w-6 h-6 rounded-full" style={{background: theme.primary}}></div>
                  <div className="w-6 h-6 rounded-full" style={{background: theme.accent}}></div>
                  <div className="w-6 h-6 rounded-full" style={{background: theme.navy}}></div>
                </div>
                <div className="text-xs font-semibold" style={{color:'#2C2C3E'}}>{theme.name}</div>
                {selectedTheme === theme.key && (
                  <div className="text-xs mt-1" style={{color: theme.primary}}>{themeSaved ? '✓ Saved' : 'Selected'}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

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
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Meal Options (optional)</label>
            <p className="text-xs mb-2" style={{color:'#6B7280'}}>Add meal choices and guests will pick one when they RSVP as attending.</p>
            {mealOptions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {mealOptions.map(option => (
                  <span key={option} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm" style={{background:'#F5EAE4', color:'#B07D6E'}}>
                    {option}
                    <button onClick={() => removeMealOption(option)} style={{color:'#DC2626'}}>×</button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={newMealOption}
                onChange={e => setNewMealOption(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMealOption())}
                placeholder="e.g. Chicken"
                className="flex-1 h-11 px-4 rounded-xl outline-none text-sm min-w-0"
                style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}}
              />
              <button onClick={addMealOption} disabled={!newMealOption.trim()} className="px-4 h-11 rounded-xl font-semibold text-sm disabled:opacity-40 flex-shrink-0" style={{background:'#F5EAE4', color:'#B07D6E'}}>
                + Add
              </button>
            </div>
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
                        {r.meal_choice && <div className="text-xs" style={{color:'#6B7280'}}>Meal: {r.meal_choice}</div>}
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

      {/* Guest FAQ */}
      <div className="bg-white rounded-2xl p-6 mb-8" style={{border:'1px solid #E8DDD8'}}>
        <h2 className="font-semibold text-lg mb-1" style={{color:'#2C2C3E'}}>❓ Guest FAQ</h2>
        <p className="text-sm mb-4" style={{color:'#6B7280'}}>Answer common questions once — parking, dress code, plus-ones — so guests stop asking you directly.</p>

        {!wedding?.is_premium ? (
          <div className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{background:'#F5EAE4'}}>
            <div>
              <div className="text-sm font-semibold" style={{color:'#2C2C3E'}}>Unlock the Guest FAQ</div>
              <div className="text-xs" style={{color:'#6B7280'}}>Plus unlimited photos, wishes wall, custom slug & more — one-time $19</div>
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
        ) : (
          <>
            {faqList.length > 0 && (
              <div className="space-y-3 mb-4">
                {faqList.map(f => (
                  <div key={f.id} className="p-4 rounded-xl" style={{background:'#F8FAFC', border:'1px solid #E8DDD8'}}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm mb-1" style={{color:'#2C2C3E'}}>{f.question}</div>
                        <div className="text-sm" style={{color:'#6B7280'}}>{f.answer}</div>
                      </div>
                      <button onClick={() => removeFaq(f.id)} className="text-xs flex-shrink-0" style={{color:'#DC2626'}}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <input
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                placeholder="e.g. Is there parking at the venue?"
                className="w-full h-11 px-4 rounded-xl outline-none text-sm"
                style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}}
              />
              <textarea
                value={newAnswer}
                onChange={e => setNewAnswer(e.target.value)}
                placeholder="e.g. Yes, free parking is available on-site."
                rows={2}
                className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none"
                style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}}
              />
              <button onClick={addFaq} disabled={addingFaq || !newQuestion.trim() || !newAnswer.trim()} className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40" style={{background:'#B07D6E', color:'#ffffff'}}>
                {addingFaq ? 'Adding...' : '+ Add Question'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Wedding Party */}
      <div className="bg-white rounded-2xl p-6 mb-8" style={{border:'1px solid #E8DDD8'}}>
        <h2 className="font-semibold text-lg mb-1" style={{color:'#2C2C3E'}}>👰🤵 Wedding Party</h2>
        <p className="text-sm mb-4" style={{color:'#6B7280'}}>Introduce your bridesmaids, groomsmen, and anyone else standing up with you.</p>

        {!wedding?.is_premium ? (
          <div className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{background:'#F5EAE4'}}>
            <div>
              <div className="text-sm font-semibold" style={{color:'#2C2C3E'}}>Unlock Wedding Party Bios</div>
              <div className="text-xs" style={{color:'#6B7280'}}>Plus unlimited photos, wishes wall, custom slug & more — one-time $19</div>
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
        ) : (
          <>
            {partyList.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {partyList.map(p => (
                  <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl" style={{background:'#F8FAFC', border:'1px solid #E8DDD8'}}>
                    {p.photo_url ? (
                      <img src={p.photo_url} alt={p.name} className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl flex-shrink-0" style={{background:'#F5EAE4'}}>👤</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm" style={{color:'#2C2C3E'}}>{p.name}</div>
                      <div className="text-xs mb-1" style={{color:'#B07D6E'}}>{p.role}</div>
                      {p.bio && <div className="text-xs" style={{color:'#6B7280'}}>{p.bio}</div>}
                    </div>
                    <button onClick={() => removePartyMember(p.id)} className="text-xs flex-shrink-0" style={{color:'#DC2626'}}>Remove</button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 p-4 rounded-xl" style={{background:'#FDFAF7', border:'1px dashed #E8DDD8'}}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={newPartyName}
                  onChange={e => setNewPartyName(e.target.value)}
                  placeholder="Name"
                  className="w-full h-11 px-4 rounded-xl outline-none text-sm"
                  style={{border:'1px solid #E8DDD8', background:'#ffffff', color:'#2C2C3E'}}
                />
                <input
                  value={newPartyRole}
                  onChange={e => setNewPartyRole(e.target.value)}
                  placeholder="Role (e.g. Maid of Honor)"
                  className="w-full h-11 px-4 rounded-xl outline-none text-sm"
                  style={{border:'1px solid #E8DDD8', background:'#ffffff', color:'#2C2C3E'}}
                />
              </div>
              <textarea
                value={newPartyBio}
                onChange={e => setNewPartyBio(e.target.value)}
                placeholder="Short bio or fun fact (optional)"
                rows={2}
                className="w-full px-4 py-3 rounded-xl outline-none text-sm resize-none"
                style={{border:'1px solid #E8DDD8', background:'#ffffff', color:'#2C2C3E'}}
              />
              <div className="flex items-center gap-3">
                {newPartyPhotoPreview ? (
                  <img src={newPartyPhotoPreview} alt="Preview" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <label className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer text-lg" style={{background:'#F5EAE4', color:'#B07D6E'}}>
                    📷
                    <input type="file" accept="image/*" onChange={handlePartyPhotoSelect} className="hidden" />
                  </label>
                )}
                <span className="text-xs" style={{color:'#6B7280'}}>Photo (optional)</span>
                <button onClick={addPartyMember} disabled={addingParty || !newPartyName.trim() || !newPartyRole.trim()} className="ml-auto px-5 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-40" style={{background:'#B07D6E', color:'#ffffff'}}>
                  {addingParty ? 'Adding...' : '+ Add'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Registry Links */}
      <div className="bg-white rounded-2xl p-6 mb-8" style={{border:'1px solid #E8DDD8'}}>
        <h2 className="font-semibold text-lg mb-1" style={{color:'#2C2C3E'}}>🎁 Registry Links</h2>
        <p className="text-sm mb-4" style={{color:'#6B7280'}}>Add links to your existing registries or a cash fund — guests see clean buttons on your guest page.</p>

        {!wedding?.is_premium ? (
          <div className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{background:'#F5EAE4'}}>
            <div>
              <div className="text-sm font-semibold" style={{color:'#2C2C3E'}}>Unlock Registry Links</div>
              <div className="text-xs" style={{color:'#6B7280'}}>Plus unlimited photos, wishes wall, custom slug & more — one-time $19</div>
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
        ) : (
          <>
            {registryList.length > 0 && (
              <div className="space-y-2 mb-4">
                {registryList.map(r => (
                  <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-xl" style={{background:'#F8FAFC', border:'1px solid #E8DDD8'}}>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm" style={{color:'#2C2C3E'}}>{r.label}</div>
                      <div className="text-xs truncate" style={{color:'#6B7280'}}>{r.url}</div>
                    </div>
                    <button onClick={() => removeRegistryLink(r.id)} className="text-xs flex-shrink-0" style={{color:'#DC2626'}}>Remove</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={newRegistryLabel}
                onChange={e => setNewRegistryLabel(e.target.value)}
                placeholder="e.g. Our Amazon Registry"
                className="flex-1 h-11 px-4 rounded-xl outline-none text-sm min-w-0"
                style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}}
              />
              <input
                value={newRegistryUrl}
                onChange={e => setNewRegistryUrl(e.target.value)}
                placeholder="Paste link here"
                className="flex-1 h-11 px-4 rounded-xl outline-none text-sm min-w-0"
                style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}}
              />
              <button onClick={addRegistryLink} disabled={addingRegistry || !newRegistryLabel.trim() || !newRegistryUrl.trim()} className="w-full sm:w-auto px-5 h-11 rounded-xl font-semibold text-sm disabled:opacity-40 flex-shrink-0" style={{background:'#B07D6E', color:'#ffffff'}}>
                {addingRegistry ? 'Adding...' : '+ Add'}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Budget Overview */}
      <div className="bg-white rounded-2xl p-6 mb-8" style={{border:'1px solid #E8DDD8'}}>
        <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>💰 Budget Overview</h2>
        {budget && budget.total_budget ? (
          (() => {
            const sym = CURRENCY_SYMBOLS[budget.currency] || '$';
            const total = budget.total_budget || 0;
            const allocated = Object.values(budget.allocations || {}).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
            const remaining = total - allocated;
            const perHead = budget.guest_count && budget.guest_count > 0 ? total / budget.guest_count : 0;
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="rounded-xl p-4 text-center" style={{background:'linear-gradient(135deg, #2C2C3E, #B07D6E)'}}>
                    <div className="text-xs uppercase tracking-wider mb-1" style={{color:'rgba(255,255,255,0.6)'}}>Total</div>
                    <div className="font-serif text-xl font-bold" style={{color:'#ffffff'}}>{sym}{total.toLocaleString()}</div>
                  </div>
                  <div className="rounded-xl p-4 text-center" style={{background: remaining >= 0 ? '#E8F0EC' : '#FEE2E2'}}>
                    <div className="text-xs uppercase tracking-wider mb-1" style={{color:'#6B7280'}}>{remaining >= 0 ? 'Remaining' : 'Overspent'}</div>
                    <div className="font-serif text-xl font-bold" style={{color: remaining >= 0 ? '#7A9E8A' : '#DC2626'}}>{sym}{Math.abs(remaining).toLocaleString()}</div>
                  </div>
                  <div className="rounded-xl p-4 text-center" style={{background:'#F5E6C8'}}>
                    <div className="text-xs uppercase tracking-wider mb-1" style={{color:'#6B7280'}}>Per Head</div>
                    <div className="font-serif text-xl font-bold" style={{color:'#D4AF7A'}}>{perHead > 0 ? `${sym}${Math.round(perHead).toLocaleString()}` : '—'}</div>
                  </div>
                </div>
                <Link href="/budget" className="text-sm font-semibold" style={{color:'#B07D6E'}}>Edit Budget →</Link>
              </>
            );
          })()
        ) : (
          <>
            <p className="text-sm mb-4" style={{color:'#6B7280'}}>You haven't set up a budget yet.</p>
            <Link href="/budget" className="inline-block font-semibold px-5 py-2.5 rounded-xl text-sm" style={{background:'#F5EAE4', color:'#B07D6E'}}>
              Set Up Your Budget
            </Link>
          </>
        )}
      </div>

      {/* Checklist & Venue Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
          <h2 className="font-semibold text-lg mb-3" style={{color:'#2C2C3E'}}>📋 Wedding Checklist</h2>
          {(() => {
            const checkedCount = checklist?.checked_items ? Object.values(checklist.checked_items).filter(Boolean).length : 0;
            const totalItems = TOTAL_CHECKLIST_ITEMS + (checklist?.custom_items?.length || 0);
            const progress = Math.round((checkedCount / totalItems) * 100);
            return checkedCount > 0 ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm" style={{color:'#6B7280'}}>{checkedCount} of {totalItems} done</span>
                  <span className="text-sm font-semibold" style={{color:'#B07D6E'}}>{progress}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden mb-4" style={{background:'#F5EAE4'}}>
                  <div className="h-full rounded-full" style={{width: `${progress}%`, background:'#B07D6E'}}></div>
                </div>
                <Link href="/checklist" className="text-sm font-semibold" style={{color:'#B07D6E'}}>Continue Checklist →</Link>
              </>
            ) : (
              <>
                <p className="text-sm mb-4" style={{color:'#6B7280'}}>You haven't started your checklist yet.</p>
                <Link href="/checklist" className="inline-block font-semibold px-5 py-2.5 rounded-xl text-sm" style={{background:'#F5EAE4', color:'#B07D6E'}}>
                  Start Checklist
                </Link>
              </>
            );
          })()}
        </div>

        <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
          <h2 className="font-semibold text-lg mb-3" style={{color:'#2C2C3E'}}>🏨 Venue Comparison</h2>
          {(() => {
            const venuesWithNames = (venueComparison?.venues || []).filter(v => v.name && v.name.trim());
            if (venuesWithNames.length === 0) {
              return (
                <>
                  <p className="text-sm mb-4" style={{color:'#6B7280'}}>No venues compared yet.</p>
                  <Link href="/venue" className="inline-block font-semibold px-5 py-2.5 rounded-xl text-sm" style={{background:'#F5EAE4', color:'#B07D6E'}}>
                    Compare Venues
                  </Link>
                </>
              );
            }
            return (
              <>
                <p className="text-sm mb-4" style={{color:'#6B7280'}}>{venuesWithNames.length} venue{venuesWithNames.length === 1 ? '' : 's'} compared, including <strong style={{color:'#2C2C3E'}}>{venuesWithNames[0].name}</strong>.</p>
                <Link href="/venue" className="text-sm font-semibold" style={{color:'#B07D6E'}}>View Comparison →</Link>
              </>
            );
          })()}
        </div>
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
