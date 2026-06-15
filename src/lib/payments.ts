import { promises as fs } from 'fs'
import path from 'path'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'expired'

export type PaymentRecord = {
  reference: string
  invoiceId: string
  name: string
  phone: string
  comment: string
  amount: number
  status: PaymentStatus
  createdAt: string
  paidAt?: string
  modifiedDate?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json')

async function ensureStore(): Promise<PaymentRecord[]> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    const raw = await fs.readFile(PAYMENTS_FILE, 'utf-8')
    return JSON.parse(raw) as PaymentRecord[]
  } catch {
    return []
  }
}

async function writeStore(records: PaymentRecord[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(PAYMENTS_FILE, JSON.stringify(records, null, 2), 'utf-8')
}

export async function savePayment(record: PaymentRecord): Promise<void> {
  const records = await ensureStore()
  records.push(record)
  await writeStore(records)
}

export async function getPaymentByInvoiceId(invoiceId: string): Promise<PaymentRecord | undefined> {
  const records = await ensureStore()
  return records.find((r) => r.invoiceId === invoiceId)
}

export async function updatePaymentByInvoiceId(
  invoiceId: string,
  patch: Partial<PaymentRecord>
): Promise<PaymentRecord | undefined> {
  const records = await ensureStore()
  const index = records.findIndex((r) => r.invoiceId === invoiceId)
  if (index === -1) return undefined

  records[index] = { ...records[index], ...patch }
  await writeStore(records)
  return records[index]
}
