import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createMonoInvoice } from '@/lib/mono'
import { savePayment } from '@/lib/payments'
import { MARATHON_PRICE, SITE_NAME, SITE_URL } from '@/app/site'

export async function POST(req: NextRequest) {
  try {
    const monoToken = process.env.MONO_TOKEN
    if (!monoToken) {
      return NextResponse.json(
        { error: 'Оплата тимчасово недоступна. Зв\'яжіться з нами.' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const name = typeof body.name === 'string' && body.name.trim() ? body.name.trim() : 'Учасник марафону'
    const phone = typeof body.phone === 'string' && body.phone.trim() ? body.phone.trim() : 'Не вказано'
    const comment = typeof body.comment === 'string' ? body.comment.trim() : ''

    const reference = crypto.randomUUID()
    const amountMinor = MARATHON_PRICE * 100
    const siteUrl = SITE_URL

    const invoice = await createMonoInvoice(monoToken, {
      amount: amountMinor,
      ccy: 980,
      merchantPaymInfo: {
        reference,
        destination: `Марафон англійської | ${SITE_NAME}`,
        comment: comment || `Оплата марафону: ${name}`,
        basketOrder: [
          {
            name: '10-тижневий марафон англійської',
            qty: 1,
            sum: amountMinor,
            total: amountMinor,
            unit: 'доступ',
            code: reference,
          },
        ],
      },
      redirectUrl: `${siteUrl}/success?ref=${reference}`,
      webHookUrl: `${siteUrl}/api/mono-webhook`,
      validity: 3600,
      paymentType: 'debit',
    })

    await savePayment({
      reference,
      invoiceId: invoice.invoiceId,
      name,
      phone,
      comment,
      amount: MARATHON_PRICE,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      reference,
      invoiceUrl: invoice.pageUrl,
    })
  } catch (error) {
    console.error('[payment/create]', error)
    const message = error instanceof Error ? error.message : 'Помилка створення оплати'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
