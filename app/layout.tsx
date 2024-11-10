import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import './globals.css'
import SideBar from '@/components/SideBar'
import SupabaseProvider from '@/Providers/SupabaseProvider'
import UserProvider from '@/Providers/UserProvider'
import ModalProvider from '@/Providers/ModalProvider'
import ToasterProvider from '@/Providers/ToasterProvider'
import getSongsByUserId from '@/actions/getSongsByUserId'

const font = Figtree({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Spotify Clone',
    description: 'Listen to music!',
}

export const revalidate = 0

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const userSongs = await getSongsByUserId()

    return (
        <html lang="en">
            <body className={font.className}>
                <ToasterProvider />
                <SupabaseProvider>
                    <UserProvider>
                        <ModalProvider />
                        <SideBar songs={userSongs}>{children}</SideBar>
                    </UserProvider>
                </SupabaseProvider>
            </body>
        </html>
    )
}
