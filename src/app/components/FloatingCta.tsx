'use client'

import { useEffect, useState } from 'react'
import PaymentButton from './PaymentButton'
import styles from './FloatingCta.module.css'

export default function FloatingCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.querySelector('[data-hero]')
    if (!hero) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.12 },
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  return (
    <PaymentButton
      className={`${styles.fab} ${visible ? styles.visible : ''}`}
      aria-label="Приєднатися до марафону"
      disabled={!visible}
    >
      <span className={styles.label}>Приєднатися</span>
      <span className={styles.discount}>-80%</span>
      <svg className={styles.arrow} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 14 L14 2 M6 2 H14 V10" />
      </svg>
    </PaymentButton>
  )
}
