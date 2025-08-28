import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Vora - Your AI Wellness Coach That Actually Cares',
  description: 'Stop treating your health like a subscription you\'ll cancel. Get personalized AI-powered wellness guidance that adapts to your real life.',
  keywords: ['AI wellness', 'health coach', 'preventative healthcare', 'AI health assistant', 'wellness app', 'health tracking'],
  authors: [{ name: 'Vora' }],
  creator: 'Vora',
  publisher: 'Vora',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://vora.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Vora - Your AI Wellness Coach That Actually Cares',
    description: 'Stop treating your health like a subscription you\'ll cancel. Get personalized AI-powered wellness guidance that adapts to your real life.',
    url: 'https://vora.ai',
    siteName: 'Vora',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Vora - AI Wellness Coach',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vora - Your AI Wellness Coach',
    description: 'Personalized AI-powered wellness guidance that adapts to your real life.',
    creator: '@vorahealth',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className={`${inter.className} bg-[#0A0A0B] text-white antialiased`}>
        {children}
      </body>
    </html>
  )
} 