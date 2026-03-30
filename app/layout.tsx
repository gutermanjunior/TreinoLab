import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { BottomNav } from '@/components/navigation/bottom-nav'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Registro de Força',
  description: 'Registre seus treinos de musculação, acompanhe seu progresso e bata seus recordes pessoais.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Registro de Força',
  },
}

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <main className="min-h-screen pb-20">
          {children}
        </main>
        <BottomNav />
        <Analytics />
      </body>
    </html>
  )
}
