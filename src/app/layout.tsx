import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Depgrow Widget — WhatsApp Chat Button for Any Website',
  description: 'Add a floating WhatsApp chat button to your website in 60 seconds. No code required.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
