'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function UploadClient({
  weddingId,
  partner1Name,
  partner2Name,
  limitReached,
}: {
  weddingId: string;
  partner1Name: string;
  partner2Name: string;
  limitReached: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError('');
  };

  const handleUpload = async () => {
    if (!file) { setError('Please choose or take a photo first.'); return; }
    setUploading(true);
    setError('');

    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const filePath = `${weddingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('wedding-photos')
      .upload(filePath, file);

    if (uploadError) {
      setError('Upload failed. Please try again.');
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('wedding-photos')
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase.from('wedding_photos').insert({
      wedding_id: weddingId,
      photo_url: urlData.publicUrl,
      uploaded_by: name || null,
    });

    if (insertError) {
      setError('Something went wrong saving your photo. Please try again.');
      setUploading(false);
      return;
    }

    setSuccess(true);
    setUploading(false);
  };

  const handleUploadAnother = () => {
    setFile(null);
    setPreview(null);
    setSuccess(false);
  };

  if (limitReached) {
    return (
      <main className="max-w-md mx-auto px-6 py-20 text-center" style={{background:'#FDFAF7', minHeight: '100vh'}}>
        <div className="text-5xl mb-6">📸</div>
        <h1 className="font-serif text-2xl font-bold mb-3" style={{color:'#2C2C3E'}}>
          Photo Gallery Full
        </h1>
        <p style={{color:'#6B7280'}}>
          {partner1Name} & {partner2Name}'s free photo gallery has reached its limit. Thanks so much for wanting to share!
        </p>
      </main>
    );
  }

  if (success) {
    return (
      <main className="max-w-md mx-auto px-6 py-20 text-center" style={{background:'#FDFAF7', minHeight: '100vh'}}>
        <div className="text-5xl mb-6">🎉</div>
        <h1 className="font-serif text-2xl font-bold mb-3" style={{color:'#2C2C3E'}}>Photo Uploaded!</h1>
        <p className="mb-8" style={{color:'#6B7280'}}>
          Thank you for sharing this moment with {partner1Name} & {partner2Name}.
        </p>
        <button
          onClick={handleUploadAnother}
          className="font-semibold px-6 py-3 rounded-xl"
          style={{background:'#B07D6E', color:'#ffffff'}}
        >
          Upload Another Photo
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-6 py-12" style={{background:'#FDFAF7', minHeight: '100vh'}}>
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">📸</div>
        <h1 className="font-serif text-2xl font-bold mb-2" style={{color:'#2C2C3E'}}>
          Share a Photo
        </h1>
        <p style={{color:'#6B7280'}}>
          {partner1Name} & {partner2Name}'s Wedding
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6" style={{border:'1px solid #E8DDD8'}}>
        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm" style={{background:'#FEE2E2', color:'#DC2626'}}>{error}</div>
        )}

        {preview ? (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="w-full rounded-xl" style={{maxHeight: '320px', objectFit: 'cover'}} />
          </div>
        ) : (
          <div className="flex gap-3 mb-4">
            <label
              className="flex-1 flex flex-col items-center justify-center h-32 rounded-xl cursor-pointer"
              style={{border: '2px dashed #E8DDD8', background: '#F8FAFC'}}
            >
              <span className="text-2xl mb-1">📷</span>
              <span className="text-xs font-medium text-center px-2" style={{color:'#6B7280'}}>Take Photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <label
              className="flex-1 flex flex-col items-center justify-center h-32 rounded-xl cursor-pointer"
              style={{border: '2px dashed #E8DDD8', background: '#F8FAFC'}}
            >
              <span className="text-2xl mb-1">🖼️</span>
              <span className="text-xs font-medium text-center px-2" style={{color:'#6B7280'}}>Choose from Gallery</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        )}

        {preview && (
          <div className="flex gap-3 mb-4">
            <label className="flex-1 text-center text-sm py-2 rounded-xl cursor-pointer" style={{color:'#B07D6E', fontWeight: 600, background: '#F5EAE4'}}>
              📷 Retake
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <label className="flex-1 text-center text-sm py-2 rounded-xl cursor-pointer" style={{color:'#B07D6E', fontWeight: 600, background: '#F5EAE4'}}>
              🖼️ Choose Different
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2" style={{color:'#475569'}}>Your Name (optional)</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="So they know who to thank"
            className="w-full h-12 px-4 rounded-xl outline-none"
            style={{border:'1px solid #E8DDD8', background:'#F8FAFC', color:'#2C2C3E'}}
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="w-full font-semibold py-3.5 rounded-xl disabled:opacity-40 flex items-center justify-center gap-2"
          style={{background:'#B07D6E', color:'#ffffff'}}
        >
          {uploading ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Uploading...</>
          ) : 'Upload Photo'}
        </button>
      </div>
    </main>
  );
}
