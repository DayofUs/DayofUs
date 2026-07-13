import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function generateSlug(name1: string, name2: string) {
  const clean = (s: string) =>
    s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '')
  return `${clean(name1)}-and-${clean(name2)}`
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const meta = data.user.user_metadata
      if (meta?.partner1_name && meta?.partner2_name) {
        const { data: existing } = await supabase
          .from('weddings')
          .select('id')
          .eq('user_id', data.user.id)
          .single()

        if (!existing) {
          const baseSlug = generateSlug(meta.partner1_name, meta.partner2_name)
          let slug = baseSlug
          let suffix = 2

          // Guarantee slug uniqueness — append -2, -3, etc. if taken
          while (true) {
            const { data: existingSlug } = await supabase
              .from('weddings')
              .select('id')
              .eq('slug', slug)
              .maybeSingle()

            if (!existingSlug) break
            slug = `${baseSlug}-${suffix}`
            suffix++
          }

          await supabase.from('weddings').insert({
            user_id: data.user.id,
            partner1_name: meta.partner1_name,
            partner2_name: meta.partner2_name,
            slug,
          })
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
