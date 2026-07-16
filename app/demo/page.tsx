import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function DemoPage() {
  return (
    <>
      <Header />
      <div style={{minHeight:'100vh', background:'#FDFAF7'}}>

        <div className="text-center py-16 px-6" style={{background:'linear-gradient(135deg, #2C2C3E, #B07D6E)'}}>
          <div className="text-4xl mb-4">💍</div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2" style={{color:'#ffffff'}}>Sarah & James</h1>
          <p className="text-lg mb-8" style={{color:'rgba(255,255,255,0.75)'}}>Saturday, 14 June 2027</p>
          <p className="text-sm mb-6" style={{color:'rgba(255,255,255,0.65)'}}>📍 The Grand Hotel</p>

          <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto mb-6">
            {[['142', 'Days'], ['14', 'Hours'], ['32', 'Mins'], ['08', 'Secs']].map(([val, label]) => (
              <div key={label} className="rounded-xl p-3" style={{background:'rgba(255,255,255,0.12)'}}>
                <div className="font-serif text-3xl font-bold" style={{color:'#ffffff'}}>{val}</div>
                <div className="text-xs" style={{color:'rgba(255,255,255,0.6)'}}>{label}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="font-bold text-xl" style={{color:'#D4AF7A'}}>87</div>
              <div className="text-xs" style={{color:'rgba(255,255,255,0.6)'}}>Guests confirmed</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-xl" style={{color:'#D4AF7A'}}>43</div>
              <div className="text-xs" style={{color:'rgba(255,255,255,0.6)'}}>Songs requested</div>
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto px-6 py-8 text-center">
          <p className="font-serif text-lg italic" style={{color:'#6B7280'}}>"We are so excited to celebrate with you all."</p>
          <p className="text-sm mt-2" style={{color:'#B07D6E'}}>— Sarah & James</p>
        </div>

        <div className="max-w-2xl mx-auto px-6 pb-16">
          <div className="mb-6 p-4 rounded-xl text-center text-sm" style={{background:'#F5EAE4', color:'#B07D6E'}}>
            👀 This is a sample page — try it with your own details for free
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
              <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>✉️ Guest RSVPs</h2>
              <div className="space-y-2">
                {[['Priya Patel', '2 guests'], ['Tom & Alex Reid', '2 guests'], ['Chloe Bennett', '1 guest']].map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between p-3 rounded-xl" style={{background:'#F0FDF4'}}>
                    <span className="text-sm font-medium" style={{color:'#2C2C3E'}}>{name}</span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-lg" style={{background:'#DCFCE7', color:'#16A34A'}}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
              <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>🎵 Song Requests</h2>
              <div className="space-y-2">
                {[['Dancing Queen', 'ABBA'], ['Perfect', 'Ed Sheeran'], ['Uptown Funk', 'Bruno Mars']].map(([track, artist], i) => (
                  <div key={track} className="flex items-center gap-3 p-3 rounded-xl" style={{background:'#F8FAFC'}}>
                    <span className="text-sm font-bold w-6 text-center" style={{color:'#B07D6E'}}>{i + 1}</span>
                    <div>
                      <div className="font-medium text-sm" style={{color:'#2C2C3E'}}>{track}</div>
                      <div className="text-xs" style={{color:'#6B7280'}}>{artist}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
              <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>📸 Photo Gallery</h2>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-square rounded-xl flex items-center justify-center text-2xl" style={{background:'#F5EAE4'}}>📷</div>
                ))}
              </div>
              <p className="text-xs mt-3 text-center" style={{color:'#6B7280'}}>Guests scan a QR code and upload straight from their phone</p>
            </div>

            <div className="bg-white rounded-2xl p-6" style={{border:'1px solid #E8DDD8'}}>
              <h2 className="font-semibold text-lg mb-4" style={{color:'#2C2C3E'}}>💌 Wishes Wall</h2>
              <div className="p-4 rounded-xl" style={{background:'#F5EAE4'}}>
                <p className="text-sm italic mb-2" style={{color:'#2C2C3E'}}>"So happy for you both — can't wait to celebrate!"</p>
                <p className="text-xs font-semibold" style={{color:'#B07D6E'}}>— Aunt Carol</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/signup" className="inline-block font-semibold px-8 py-4 rounded-full" style={{background:'#B07D6E', color:'#ffffff'}}>
              Create Your Free Wedding Page
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
