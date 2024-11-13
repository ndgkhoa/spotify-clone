'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import SearchInput from '@/components/SearchInput'
import SearchContent from './components/SearchContent'
import Box from '@/components/Box'
import { ClipLoader } from 'react-spinners'

const Search = () => {
    const searchParams = useSearchParams()
    const title = searchParams.get('title') || ''
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSongs = async () => {
            setLoading(true)
            const response = await fetch(`/api/get-songs?title=${title}`)
            const data = await response.json()
            setSongs(data)
            setLoading(false)
        }

        fetchSongs()
    }, [title])

    return (
        <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
            <Header className="from-bg-neutral-900">
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-white text-3xl font-semibold">
                        Search
                    </h1>
                    <SearchInput />
                </div>
            </Header>

            {loading ? (
                <Box className="h-[500px] flex items-center justify-center">
                    <ClipLoader color="#22c55e" size={40} />
                </Box>
            ) : (
                <SearchContent songs={songs} />
            )}
        </div>
    )
}

export default Search
