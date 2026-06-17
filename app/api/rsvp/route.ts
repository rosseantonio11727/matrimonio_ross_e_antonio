import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    const body = await req.json()

    if (!body.first_name || !body.last_name || !body.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('guests')
      .select('id')
      .eq('email', body.email)
      .single()

    if (existing) {
      const { error } = await supabase
        .from('guests')
        .update({ ...body, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('guests')
        .insert([body])
      if (error) throw error
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('RSVP error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
