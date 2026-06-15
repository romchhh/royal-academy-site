import type { Metadata } from 'next'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MarathonSections from './components/MarathonSections'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import FloatingCta from './components/FloatingCta'
import StructuredData from './components/StructuredData'
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from './site'

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
}

export default function Home() {
  return (
    <div className="marathon-page">
      <StructuredData />
      <Navbar transparent />
      <main>
        <Hero />
        <MarathonSections />
        <ContactSection />
      </main>
      <Footer />
      <FloatingCta />
    </div>
  )
}
