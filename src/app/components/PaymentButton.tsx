'use client'

import { useState, type MouseEvent, type ReactNode } from 'react'
import { startPayment, type PaymentPayload } from '@/lib/startPayment'

type PaymentButtonProps = {
  className?: string
  children: ReactNode
  'aria-label'?: string
  payload?: PaymentPayload
  disabled?: boolean
  onBeforePayment?: () => void
  loadingLabel?: string
}

export default function PaymentButton({
  className,
  children,
  'aria-label': ariaLabel,
  payload,
  disabled,
  onBeforePayment,
  loadingLabel = 'Перенаправлення на оплату…',
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (loading || disabled) return

    onBeforePayment?.()
    setLoading(true)

    try {
      await startPayment(payload)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Сталася помилка. Спробуйте ще раз.'
      window.alert(message)
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={loading || disabled}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {loading ? loadingLabel : children}
    </button>
  )
}
