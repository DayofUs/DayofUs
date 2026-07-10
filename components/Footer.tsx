import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy text-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💍</span>
              <span className="font-serif text-xl font-bold">Day of Us</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">Free wedding planning tools for every couple. Budget calculators, RSVP management, playlist requests and more.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Planning Tools</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/budget" className="hover:text-white transition-colors">Wedding Budget Calculator</Link></li>
              <li><Link href="/countdown" className="hover:text-white transition-colors">Wedding Countdown</Link></li>
              <li><Link href="/rsvp" className="hover:text-white transition-colors">Guest RSVP</Link></li>
              <li><Link href="/playlist" className="hover:text-white transition-colors">Song Requests</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-4 text-gray-300 uppercase tracking-wider">Info</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} Day of Us. All rights reserved. Free to use — no sign-up required for basic tools.
        </div>
      </div>
    </footer>
  );
}
