import './globals.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

const inter = Poppins({ subsets: ['latin'], weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'] })

export const metadata: Metadata = {
  title: 'NT LAN',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className='text-white bg-zinc-900'>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
