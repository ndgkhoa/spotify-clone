'use client'

import { Song } from '@/types'
import MediaItem from './MediaItem'
import LikeButton from './LikeButton'
import { BsPauseFill, BsPlayFill } from 'react-icons/bs'
import { AiFillStepBackward, AiFillStepForward } from 'react-icons/ai'
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2'
import Slider from './Slider'
import usePlayer from '@/hooks/usePlayer'
import { useEffect, useState } from 'react'
import useSound from 'use-sound'

interface PlayerContentProps {
    song: Song
    songUrl: string
}

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
}

const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
    const player = usePlayer()
    const [volume, setVolume] = useState(1)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const Icon = isPlaying ? BsPauseFill : BsPlayFill
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave

    const [play, { pause, sound }] = useSound(songUrl, {
        volume: volume,
        onplay: () => setIsPlaying(true),
        onend: () => {
            setIsPlaying(false)
            onPlayNext()
        },
        onpause: () => setIsPlaying(false),
        format: ['mp3'],
    })

    const onPlayNext = () => {
        if (player.ids.length === 0) return

        const currentIndex = player.ids.findIndex(
            (id) => id === player.activeId,
        )
        const nextSong = player.ids[currentIndex + 1] || player.ids[0]
        player.setId(nextSong)
    }

    const onPlayPrevious = () => {
        if (player.ids.length === 0) return

        const currentIndex = player.ids.findIndex(
            (id) => id === player.activeId,
        )
        const previousSong =
            player.ids[currentIndex - 1] || player.ids[player.ids.length - 1]
        player.setId(previousSong)
    }

    useEffect(() => {
        if (sound) {
            setDuration(sound.duration() || 0)

            const interval = setInterval(() => {
                setCurrentTime(sound.seek() || 0)
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [sound])

    useEffect(() => {
        sound?.play()
        return () => sound?.unload()
    }, [sound])

    const handlePlay = () => {
        if (!isPlaying) {
            play()
        } else {
            pause()
        }
    }

    const toggleMute = () => {
        setVolume(volume === 0 ? 1 : 0)
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="flex w-full justify-start">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} />
                    <LikeButton songId={song.id} />
                </div>
            </div>

            <div className="flex md:hidden col-auto w-full justify-end items-center">
                <div
                    onClick={handlePlay}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
                >
                    <Icon size={30} className="text-black" />
                </div>
            </div>

            <div className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
                <AiFillStepBackward
                    onClick={onPlayPrevious}
                    size={30}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                />
                <div
                    onClick={handlePlay}
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
                >
                    <Icon size={30} className="text-black" />
                </div>
                <AiFillStepForward
                    onClick={onPlayNext}
                    size={30}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                />
            </div>

            <div className="hidden md:flex w-full justify-end pr-2 items-center gap-x-4">
                <span className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                <div className="flex items-center gap-x-2 w-[120px]">
                    <VolumeIcon
                        onClick={toggleMute}
                        className="cursor-pointer"
                        size={34}
                    />
                    <Slider
                        value={volume}
                        onChange={(value) => setVolume(value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default PlayerContent
