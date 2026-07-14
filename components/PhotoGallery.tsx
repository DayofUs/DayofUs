'use client';
import { useState } from 'react';

interface Photo {
  id: string;
  photo_url: string;
  uploaded_by: string | null;
}

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (photo: Photo) => {
    setDownloading(true);
    try {
      const res = await fetch(photo.photo_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wedding-photo-${photo.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(photo.photo_url, '_blank');
    }
    setDownloading(false);
  };

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {photos.map(p => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="aspect-square rounded-xl overflow-hidden"
            style={{background:'#F8FAFC'}}
          >
            <img src={p.photo_url} alt={p.uploaded_by || 'Wedding photo'} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{background:'rgba(44,44,62,0.9)'}}
          onClick={() => setSelected(null)}
        >
          <div className="max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <img
              src={selected.photo_url}
              alt={selected.uploaded_by || 'Wedding photo'}
              className="w-full rounded-xl mb-4"
              style={{maxHeight:'70vh', objectFit:'contain'}}
            />
            <div className="flex gap-3">
              <button
                onClick={() => handleDownload(selected)}
                disabled={downloading}
                className="flex-1 py-3 rounded-xl font-semibold text-sm disabled:opacity-40"
                style={{background:'#B07D6E', color:'#ffffff'}}
              >
                {downloading ? 'Downloading...' : '⬇ Download'}
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-5 py-3 rounded-xl font-semibold text-sm"
                style={{background:'rgba(255,255,255,0.15)', color:'#ffffff'}}
              >
                Close
              </button>
            </div>
            {selected.uploaded_by && (
              <p className="text-center text-sm mt-3" style={{color:'rgba(255,255,255,0.7)'}}>
                Shared by {selected.uploaded_by}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
