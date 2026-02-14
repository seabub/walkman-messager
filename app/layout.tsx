import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Caveat } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })
export const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
})

export const metadata: Metadata = {
  title: 'Walkman Messager',
  description: 'A digital mixtape, a sticky note, and a few memories of our own.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${caveat.variable}`}>{children}</body>
    </html>
  )
}
