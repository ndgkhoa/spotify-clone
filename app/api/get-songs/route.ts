import { Song } from '@/types'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { PostgrestError } from '@supabase/supabase-js'

export const GET = async (req: Request) => {
    const url = new URL(req.url)
    const title = url.searchParams.get('title') || ''

    const supabase = createServerComponentClient({
        cookies: cookies,
    })

    let data: Song[] = []
    let error: PostgrestError | null = null

    if (!title) {
        const response = await supabase
            .from('songs')
            .select('*')
            .order('created_at', { ascending: false })
        data = response.data || []
        error = response.error
    } else {
        const response = await supabase
            .from('songs')
            .select('*')
            .ilike('title', `%${title}%`)
            .order('created_at', { ascending: false })
        data = response.data || []
        error = response.error
    }

    if (error) {
        console.log(error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        })
    }

    return new Response(JSON.stringify(data))
}
