'use client';
import { useState } from 'react';
import JSZip from 'jszip';

interface Photo {
  id: string;
  photo_url: string;
  uploaded_by: string | null;
  media_type?: string | null;
}

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isVideo = (p: Photo) => p.media_type === 'video';

  const handleDownload = async (photo: Photo) => {
    setDownloading(true);
    try {
      const res = await fetch(photo.photo_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = photo.photo_url.split('.').pop()?.split('?')[0] || (isVideo(photo) ? 'mp4' : 'jpg');
      a.download = `wedding-${isVideo(photo) ? 'video' : 'photo'}-${photo.id}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(photo.photo_url, '_blank');
    }
    setDownloading(false);
  };

  const downloadAsZip = async (items: Photo[], filename: string) => {
    try {
      const zip = new JSZip();
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        try {
          const res = await fetch(item.photo_url);
          const blob = await res.blob();
          const ext = item.photo_url.split('.').pop()?.split('?')[0] || (isVideo(item) ? 'mp4' : 'jpg');
          zip.file(`${isVideo(item) ? 'video' : 'photo'}-${i + 1}-${item.id}.${ext}`, blob);
        } catch {
          // Skip any item that fails to fetch rather than aborting the whole download
        }
        setDownloadProgress(Math.round(((i + 1) / items.length) * 100));
      }
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert('Something went wrong creating the download. Please try again.');
    }
  };

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    setDownloadProgress(0);
    await downloadAsZip(photos, 'wedding-photos.zip');
    setDownloadingAll(false);
    setDownloadProgress(0);
  };

  const handleDownloadSelected = async () => {
    const items = photos.filter(p => selectedIds.has(p.id));
    if (items.length === 0) return;
    setDownloadingAll(true);
    setDownloadProgress(0);
    await downloadAsZip(items, `wedding-selected-${items.length}.zip`);
    setDownloadingAll(false);
    setDownloadProgress(0);
    setSelectedIds(new Set());
    setSelectMode(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === photos.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(photos.map(p => p.id)));
    }
  };

  return (
    <>
      {photos.length > 1 && (
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <button
              onClick={handleDownloadAll}
              disabled={downloadingAll}
              className="flex-1 py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
              style={{background:'#F5EAE4', color:'#B07D6E'}}
            >
              {downloadingAll && !selectMode ? `Preparing... ${downloadProgress}%` : `⬇ Download All (${photos.length})`}
            </button>
            <button
              onClick={() => { setSelectMode(!selectMode); setSelectedIds(new Set()); }}
              className="px-4 py-3 rounded-xl font-semibold text-sm"
              style={{background: selectMode ? '#B07D6E' : '#F8FAFC', color: selectMode ? '#ffffff' : '#6B7280', border: '1px solid #E8DDD8'}}
            >
              {selectMode ? 'Cancel' : 'Select'}
            </button>
          </div>

          {selectMode && (
            <div className="flex items-center justify-between gap-2 p-3 rounded-xl" style={{background:'#F8FAFC'}}>
              <button onClick={toggleSelectAll} className="text-sm font-semibold" style={{color:'#B07D6E'}}>
                {selectedIds.size === photos.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={handleDownloadSelected}
                disabled={selectedIds.size === 0 || downloadingAll}
                className="px-4 py-2 rounded-lg font-semibold text-xs disabled:opacity-40"
                style={{background:'#B07D6E', color:'#ffffff'}}
              >
                {downloadingAll ? `${downloadProgress}%` : `Download Selected (${selectedIds.size})`}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {photos.map(p => (
          <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden" style={{background:'#F8FAFC'}}>
            <button
              onClick={() => selectMode ? toggleSelect(p.id) : setSelected(p)}
              className="w-full h-full"
            >
              {isVideo(p) ? (
                <div className="relative w-full h-full">
                  <video src={p.photo_url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                  <div className="absolute inset-0 flex items-center justify-center" style={{background:'rgba(0,0,0,0.2)'}}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background:'rgba(255,255,255,0.9)'}}>
                      <div style={{width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '10px solid #2C2C3E', marginLeft: '3px'}} />
                    </div>
                  </div>
                </div>
              ) : (
                <img src={p.photo_url} alt={p.uploaded_by || 'Wedding photo'} className="w-full h-full object-cover" />
              )}
            </button>
            {selectMode && (
              <div
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2"
                style={{background: selectedIds.has(p.id) ? '#B07D6E' : 'rgba(255,255,255,0.8)', borderColor: selectedIds.has(p.id) ? '#B07D6E' : '#E8DDD8'}}
              >
                {selectedIds.has(p.id) && <span style={{color:'#ffffff', fontSize:'12px'}}>✓</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{background:'rgba(44,44,62,0.9)'}}
          onClick={() => setSelected(null)}
        >
          <div className="max-w-lg w-full" onClick={e => e.stopPropagation()}>
            {isVideo(selected) ? (
              <video src={selected.photo_url} controls autoPlay className="w-full rounded-xl mb-4" style={{maxHeight:'70vh'}} />
            ) : (
              <img
                src={selected.photo_url}
                alt={selected.uploaded_by || 'Wedding photo'}
                className="w-full rounded-xl mb-4"
                style={{maxHeight:'70vh', objectFit:'contain'}}
              />
            )}
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
