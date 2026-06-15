import { NextRequest, NextResponse } from 'next/server'
import {
  fetchMonoPublicKey,
  verifyMonoWebhookSignature,
  type MonoWebhookPayload,
} from '@/lib/mono'
import { getPaymentByInvoiceId, updatePaymentByInvoiceId } from '@/lib/payments'
import { sendPaymentNotification } from '@/lib/telegram'

export async function POST(req: NextRequest) {
  try {
    const monoToken = process.env.MONO_TOKEN
    if (!monoToken) {
      return NextResponse.json({ error: 'Not configured' }, { status: 500 })
    }

    const rawBody = await req.text()
    const signature = req.headers.get('x-sign') ?? ''

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const publicKey = await fetchMonoPublicKey(monoToken)
    const isValid = verifyMonoWebhookSignature(publicKey, Buffer.from(rawBody), signature)

    if (!isValid) {
      console.error('[mono-webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody) as MonoWebhookPayload
    const { invoiceId, status, modifiedDate } = payload

    if (!invoiceId) {
      return NextResponse.json({ ok: true })
    }

    const payment = await getPaymentByInvoiceId(invoiceId)
    if (!payment) {
      console.warn('[mono-webhook] Unknown invoice:', invoiceId)
      return NextResponse.json({ ok: true })
    }

    if (status === 'success') {
      if (payment.status !== 'paid') {
        const updated = await updatePaymentByInvoiceId(invoiceId, {
          status: 'paid',
          paidAt: new Date().toISOString(),
          modifiedDate,
        })

        if (updated) {
          try {
            await sendPaymentNotification(updated)
          } catch (error) {
            console.error('[mono-webhook] Telegram notification failed:', error)
          }
        }
      }
    } else if (status === 'failure' || status === 'reversed') {
      await updatePaymentByInvoiceId(invoiceId, {
        status: 'failed',
        modifiedDate,
      })
    } else if (status === 'expired') {
      await updatePaymentByInvoiceId(invoiceId, {
        status: 'expired',
        modifiedDate,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[mono-webhook]', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
