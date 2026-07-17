import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20" style={{background:'#2C2C3E', color:'#ffffff'}}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💍</span>
              <span className="font-serif text-xl font-bold" style={{color:'#ffffff'}}>Day of Us</span>
            </div>
            <p className="text-sm leading-relaxed" style={{color:'#D1D5DB'}}>A free wedding page for you and your guests — RSVPs, song requests, photo uploads and wishes, all in one link.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{color:'#E5E7EB'}}>Product</h4>
            <ul className="space-y-2 text-sm" style={{color:'#D1D5DB'}}>
              <li><Link href="/signup" className="hover:text-white transition-colors">Create Your Wedding Page</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Log In</Link></li>
              <li><Link href="/demo" className="hover:text-white transition-colors">See a Live Example</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{color:'#E5E7EB'}}>Free Quick Tools</h4>
            <ul className="space-y-2 text-sm" style={{color:'#D1D5DB'}}>
              <li><Link href="/budget" className="hover:text-white transition-colors">Wedding Budget Calculator</Link></li>
              <li><Link href="/countdown" className="hover:text-white transition-colors">Wedding Countdown</Link></li>
              <li><Link href="/rsvp" className="hover:text-white transition-colors">Guest RSVP</Link></li>
              <li><Link href="/playlist" className="hover:text-white transition-colors">Song Requests</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{color:'#E5E7EB'}}>Info</h4>
            <ul className="space-y-2 text-sm" style={{color:'#D1D5DB'}}>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 text-xs text-center" style={{borderTop:'1px solid #4B5563', color:'#9CA3AF'}}>
          © {new Date().getFullYear()} Day of Us. All rights reserved. Free to start — upgrade only if you want to.
        </div>
      </div>
    </footer>
  );
}
