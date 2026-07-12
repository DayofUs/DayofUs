import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
          await supabase.from('weddings').insert({
            user_id: data.user.id,
            partner1_name: meta.partner1_name,
            partner2_name: meta.partner2_name,
          })
        }
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
