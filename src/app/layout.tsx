import type { Metadata, Viewport } from 'next'
import { montserrat } from './fonts'
import { rootMetadata } from './seo'
import './globals.css'
import './site.css'

export const metadata: Metadata = rootMetadata

export const viewport: Viewport = {
  themeColor: '#C41E3A',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={montserrat.variable}>
      <body className={montserrat.className}>{children}</body>
    </html>
  )
}
