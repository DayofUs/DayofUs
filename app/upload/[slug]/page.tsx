export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server'
import UploadClient from './UploadClient'
import { notFound } from 'next/navigation'

export default async function UploadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: wedding } = await supabase
    .from('weddings')
    .select('id, partner1_name, partner2_name, is_premium')
    .eq('slug', slug)
    .single()

  if (!wedding) notFound()

  const { count } = await supabase
    .from('wedding_photos')
    .select('id', { count: 'exact', head: true })
    .eq('wedding_id', wedding.id)

  const photoCount = count ?? 0
  const FREE_PHOTO_LIMIT = 30
  const limitReached = !wedding.is_premium && photoCount >= FREE_PHOTO_LIMIT

  return (
    <UploadClient
      weddingId={wedding.id}
      partner1Name={wedding.partner1_name}
      partner2Name={wedding.partner2_name}
      limitReached={limitReached}
    />
  )
}

