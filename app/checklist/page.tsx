'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistSection {
  timeframe: string;
  items: ChecklistItem[];
}

const sections: ChecklistSection[] = [
  {
    timeframe: '12+ Months Before',
    items: [
      { id: 'budget', text: 'Set your overall wedding budget' },
      { id: 'guestlist', text: 'Draft a rough guest list and headcount' },
      { id: 'date', text: 'Choose your wedding date' },
      { id: 'venue-research', text: 'Research and book your ceremony & reception venue' },
      { id: 'style', text: 'Decide on your wedding style and colour palette' },
    ],
  },
  {
    timeframe: '9 Months Before',
    items: [
      { id: 'photographer', text: 'Book your photographer and videographer' },
      { id: 'caterer', text: 'Book catering (if not included with venue)' },
      { id: 'attire', text: 'Start shopping for wedding attire' },
      { id: 'website', text: 'Create your wedding page and share it with guests' },
    ],
  },
  {
    timeframe: '6 Months Before',
    items: [
      { id: 'invites', text: 'Order or design your invitations' },
      { id: 'music', text: 'Book your band, DJ, or set up a song request playlist' },
      { id: 'flowers', text: 'Book a florist' },
      { id: 'cake', text: 'Taste and book your wedding cake' },
      { id: 'accommodation', text: 'Block out accommodation for out-of-town guests' },
    ],
  },
  {
    timeframe: '3 Months Before',
    items: [
      { id: 'send-invites', text: 'Send out invitations' },
      { id: 'rsvp-tracking', text: 'Start tracking RSVPs and dietary requirements' },
      { id: 'menu', text: 'Finalise your menu and drinks' },
      { id: 'vows', text: 'Start writing your vows or ceremony readings' },
      { id: 'legal', text: 'Sort out marriage licence paperwork' },
    ],
  },
  {
    timeframe: '1 Month Before',
    items: [
      { id: 'final-headcount', text: 'Confirm final guest headcount with venue/caterer' },
      { id: 'seating', text: 'Finalise seating chart' },
      { id: 'payments', text: 'Confirm final payments to all vendors' },
      { id: 'speeches', text: 'Confirm who is giving speeches or toasts' },
      { id: 'emergency-kit', text: 'Put together a wedding day emergency kit' },
    ],
  },
  {
    timeframe: '1 Week Before',
    items: [
      { id: 'final-numbers', text: 'Give venue and caterer final numbers' },
      { id: 'confirm-vendors', text: 'Confirm arrival times with all vendors' },
      { id: 'pack', text: 'Pack for the wedding night and honeymoon' },
      { id: 'delegate', text: 'Delegate day-of tasks to your wedding party' },
    ],
  },
  {
    timeframe: 'Day Of',
    items: [
      { id: 'eat', text: 'Eat a proper breakfast' },
      { id: 'qr-code', text: 'Set up your photo QR code for guests' },
      { id: 'phone-charged', text: 'Make sure your phone is charged' },
      { id: 'relax', text: 'Take a moment to breathe and enjoy it' },
    ],
  },
];

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [customItems, setCustomItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [weddingId, setWeddingId] = useState<string | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(true);

  useEffect(() => {
    const loadSavedChecklist = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoadingAccount(false);
        return;
      }

      const { data: wedding } = await supabase
        .from('weddings')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!wedding) {
        setLoadingAccount(false);
        return;
      }

      setWeddingId(wedding.id);

      const { data: savedChecklist } = await supabase
        .from('wedding_checklist')
        .select('checked_items, custom_items')
        .eq('wedding_id', wedding.id)
        .maybeSingle();

      if (savedChecklist?.checked_items) {
        setChecked(savedChecklist.checked_items);
      }
      if (savedChecklist?.custom_items && Array.isArray(savedChecklist.custom_items)) {
        setCustomItems(savedChecklist.custom_items);
      }

      setLoadingAccount(false);
    };

    loadSavedChecklist();
  }, []);

  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0) + customItems.length;
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const toggle = (id: string) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);

    // Auto-save silently in the background if signed in — no explicit save button needed
    if (weddingId) {
      const supabase = createClient();
      supabase.from('wedding_checklist').upsert({
        wedding_id: weddingId,
        checked_items: updated,
        custom_items: customItems,
        updated_at: new Date().toISOString(),
      }).then();
    }
  };

  const addCustomItem = () => {
    if (!newItemText.trim()) return;
    const newItem = { id: `custom-${Date.now()}`, text: newItemText.trim() };
    const updated = [...customItems, newItem];
    setCustomItems(updated);
    setNewItemText('');

    if (weddingId) {
      const supabase = createClient();
      supabase.from('wedding_checklist').upsert({
        wedding_id: weddingId,
        checked_items: checked,
        custom_items: updated,
        updated_at: new Date().toISOString(),
      }).then();
    }
  };

  const removeCustomItem = (id: string) => {
    const updated = customItems.filter(item => item.id !== id);
    setCustomItems(updated);
    const updatedChecked = { ...checked };
    delete updatedChecked[id];
    setChecked(updatedChecked);

    if (weddingId) {
      const supabase = createClient();
      supabase.from('wedding_checklist').upsert({
        wedding_id: weddingId,
        checked_items: updatedChecked,
        custom_items: updated,
        updated_at: new Date().toISOString(),
      }).then();
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4" style={{color:'#2C2C3E'}}>Wedding Planning Checklist</h1>
          <p style={{color:'#6B7280'}}>A complete month-by-month checklist from a year out to the morning of your wedding. Check items off as you go.</p>
        </div>

        {!loadingAccount && weddingId && (
          <div className="mb-6 p-3 rounded-xl text-sm text-center" style={{background:'#F0FDF4', color:'#16A34A'}}>
            ✓ Your progress saves automatically as you check things off
          </div>
        )}

        {!loadingAccount && !weddingId && (
          <div className="mb-6 p-4 rounded-xl text-sm text-center" style={{background:'#FEF3C7', color:'#92400E'}}>
            You're not signed in — your progress won't be remembered. <a href="/login" className="font-semibold underline">Sign in</a> or <a href="/signup" className="font-semibold underline">create a free account</a> to save it automatically.
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 mb-8" style={{border:'1px solid #E8DDD8'}}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{color:'#2C2C3E'}}>Your Progress</span>
            <span className="text-sm font-semibold" style={{color:'#B07D6E'}}>{checkedCount} of {totalItems} done</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{background:'#F5EAE4'}}>
            <div className="h-full rounded-full transition-all" style={{width: `${progress}%`, background:'#B07D6E'}}></div>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map(section => (
            <div key={section.timeframe} className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
              <h2 className="font-serif text-xl font-bold mb-4" style={{color:'#2C2C3E'}}>{section.timeframe}</h2>
              <div className="space-y-2">
                {section.items.map(item => (
                  <label key={item.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors" style={{background: checked[item.id] ? '#F0FDF4' : '#F8FAFC'}}>
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="w-5 h-5 rounded flex-shrink-0"
                      style={{accentColor: '#7A9E8A'}}
                    />
                    <span className="text-sm" style={{color: checked[item.id] ? '#16A34A' : '#2C2C3E', textDecoration: checked[item.id] ? 'line-through' : 'none'}}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
            <h2 className="font-serif text-xl font-bold mb-4" style={{color:'#2C2C3E'}}>Your Own Tasks</h2>
            <div className="space-y-2 mb-4">
              {customItems.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl" style={{background: checked[item.id] ? '#F0FDF4' : '#F8FAFC'}}>
                  <label className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!checked[item.id]}
                      onChange={() => toggle(item.id)}
                      className="w-5 h-5 rounded flex-shrink-0"
                      style={{accentColor: '#7A9E8A'}}
                    />
                    <span className="text-sm truncate" style={{color: checked[item.id] ? '#16A34A' : '#2C2C3E', textDecoration: checked[item.id] ? 'line-through' : 'none'}}>
                      {item.text}
                    </span>
                  </label>
                  <button onClick={() => removeCustomItem(item.id)} className="flex-shrink-0 text-xs" style={{color:'#DC2626'}}>Remove</button>
                </div>
              ))}
              {customItems.length === 0 && (
                <p className="text-sm" style={{color:'#6B7280'}}>Add anything specific to your wedding that isn't already on the list.</p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={newItemText}
                onChange={e => setNewItemText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomItem()}
                placeholder="e.g. Book hair trial"
                className="flex-1 h-11 px-4 rounded-xl outline-none text-sm min-w-0"
                style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}}
              />
              <button onClick={addCustomItem} disabled={!newItemText.trim()} className="w-full sm:w-auto px-5 h-11 rounded-xl font-semibold text-sm disabled:opacity-40 flex-shrink-0" style={{background:'#B07D6E', color:'#ffffff'}}>
                + Add Task
              </button>
            </div>
          </div>
        </div>

        {!weddingId && (
          <div className="mt-10 text-center bg-white rounded-2xl p-8" style={{border:'1px solid #E8DDD8'}}>
            <div className="text-3xl mb-4">💍</div>
            <h3 className="font-serif text-2xl font-bold mb-2" style={{color:'#2C2C3E'}}>Keep It All in One Place</h3>
            <p className="text-sm mb-6" style={{color:'#6B7280'}}>Create a free wedding page to track your budget, RSVPs, and countdown alongside this checklist.</p>
            <Link href="/signup" className="inline-block font-semibold px-8 py-4 rounded-full" style={{background:'#B07D6E', color:'#ffffff'}}>
              Create Your Free Wedding Page
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
