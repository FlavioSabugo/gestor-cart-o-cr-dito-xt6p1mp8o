import { CreditCard, Transaction, CategorizationRule, UploadHistory } from '@/types/finance'

const DB_KEY = 'finance_db_v2'

interface Database {
  cards: CreditCard[]
  transactions: Transaction[]
  rules: CategorizationRule[]
  uploads: UploadHistory[]
}

const DEFAULT_RULES: CategorizationRule[] = [
  { id: 'r1', keyword: 'uber', category: 'Uber' },
  { id: 'r2', keyword: '99app', category: 'Transporte' },
  { id: 'r3', keyword: 'farmacia', category: 'Farmácias' },
  { id: 'r4', keyword: 'drogasil', category: 'Farmácias' },
  { id: 'r5', keyword: 'pague menos', category: 'Farmácias' },
  { id: 'r6', keyword: 'netflix', category: 'Assinaturas' },
  { id: 'r7', keyword: 'spotify', category: 'Assinaturas' },
  { id: 'r8', keyword: 'amazon prime', category: 'Assinaturas' },
]

const MOCK_CARD: CreditCard = {
  id: 'c1',
  name: 'Cartão Principal',
  brand: 'mastercard',
  limit: 5000,
  closingDate: 5,
  dueDate: 12,
  color: 'bg-gradient-to-br from-purple-600 to-indigo-700',
  last4: '1234',
}

const today = new Date()
const currentMonth = String(today.getMonth() + 1).padStart(2, '0')
const currentYear = String(today.getFullYear())

const lastMonthDate = new Date()
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
const lastMonth = String(lastMonthDate.getMonth() + 1).padStart(2, '0')
const lastYear = String(lastMonthDate.getFullYear())

const twoMonthsAgoDate = new Date()
twoMonthsAgoDate.setMonth(twoMonthsAgoDate.getMonth() - 2)
const twoMonthsAgo = String(twoMonthsAgoDate.getMonth() + 1).padStart(2, '0')
const twoMonthsAgoYear = String(twoMonthsAgoDate.getFullYear())

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    date: new Date().toISOString(),
    description: 'Uber *Trip',
    amount: 25.5,
    category: 'Uber',
    cardId: 'c1',
    billingMonth: currentMonth,
    billingYear: currentYear,
  },
  {
    id: 't2',
    date: new Date(Date.now() - 86400000).toISOString(),
    description: 'Posto Ipiranga',
    amount: 150.0,
    category: 'Combustível',
    cardId: 'c1',
    billingMonth: currentMonth,
    billingYear: currentYear,
  },
  {
    id: 't3',
    date: lastMonthDate.toISOString(),
    description: 'Netflix',
    amount: 39.9,
    category: 'Assinaturas',
    cardId: 'c1',
    billingMonth: lastMonth,
    billingYear: lastYear,
  },
  {
    id: 't4',
    date: twoMonthsAgoDate.toISOString(),
    description: 'Netflix',
    amount: 39.9,
    category: 'Assinaturas',
    cardId: 'c1',
    billingMonth: twoMonthsAgo,
    billingYear: twoMonthsAgoYear,
  },
  {
    id: 't5',
    date: lastMonthDate.toISOString(),
    description: 'Uber *Trip',
    amount: 45.0,
    category: 'Uber',
    cardId: 'c1',
    billingMonth: lastMonth,
    billingYear: lastYear,
  },
  {
    id: 't6',
    date: lastMonthDate.toISOString(),
    description: 'Posto Shell',
    amount: 100.0,
    category: 'Combustível',
    cardId: 'c1',
    billingMonth: lastMonth,
    billingYear: lastYear,
  },
  {
    id: 't7',
    date: lastMonthDate.toISOString(),
    description: 'Spotify',
    amount: 21.9,
    category: 'Assinaturas',
    cardId: 'c1',
    billingMonth: lastMonth,
    billingYear: lastYear,
  },
  {
    id: 't8',
    date: twoMonthsAgoDate.toISOString(),
    description: 'Spotify',
    amount: 21.9,
    category: 'Assinaturas',
    cardId: 'c1',
    billingMonth: twoMonthsAgo,
    billingYear: twoMonthsAgoYear,
  },
]

const getDb = (): Database => {
  const data = localStorage.getItem(DB_KEY)
  if (data) return JSON.parse(data)
  return {
    cards: [MOCK_CARD],
    transactions: MOCK_TRANSACTIONS,
    rules: DEFAULT_RULES,
    uploads: [],
  }
}

const saveDb = (db: Database) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const api = {
  getInitialData: async (): Promise<Database> => {
    await delay(800) // Simulate network delay
    return getDb()
  },

  addCard: async (card: Omit<CreditCard, 'id'>): Promise<CreditCard> => {
    await delay(500)
    const db = getDb()
    const newCard = { ...card, id: Math.random().toString(36).substr(2, 9) }
    db.cards.push(newCard)
    saveDb(db)
    return newCard
  },

  updateCard: async (id: string, updated: Omit<CreditCard, 'id'>): Promise<CreditCard> => {
    await delay(500)
    const db = getDb()
    const index = db.cards.findIndex((c) => c.id === id)
    if (index === -1) throw new Error('Card not found')
    const newCard = { ...updated, id }
    db.cards[index] = newCard
    saveDb(db)
    return newCard
  },

  deleteCard: async (id: string): Promise<void> => {
    await delay(500)
    const db = getDb()
    db.cards = db.cards.filter((c) => c.id !== id)
    db.transactions = db.transactions.filter((t) => t.cardId !== id)
    saveDb(db)
  },

  addTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    await delay(300)
    const db = getDb()
    const newTx = { ...transaction, id: Math.random().toString(36).substr(2, 9) }
    db.transactions.unshift(newTx)
    saveDb(db)
    return newTx
  },

  addTransactions: async (transactions: Omit<Transaction, 'id'>[]): Promise<Transaction[]> => {
    await delay(800)
    const db = getDb()
    const newTxs = transactions.map((t) => ({
      ...t,
      id: Math.random().toString(36).substr(2, 9),
    }))
    db.transactions = [...newTxs, ...db.transactions]
    saveDb(db)
    return newTxs
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await delay(300)
    const db = getDb()
    db.transactions = db.transactions.filter((t) => t.id !== id)
    saveDb(db)
  },

  addRule: async (rule: Omit<CategorizationRule, 'id'>): Promise<CategorizationRule> => {
    await delay(300)
    const db = getDb()
    const newRule = { ...rule, id: Math.random().toString(36).substr(2, 9) }
    db.rules.push(newRule)
    saveDb(db)
    return newRule
  },

  deleteRule: async (id: string): Promise<void> => {
    await delay(300)
    const db = getDb()
    db.rules = db.rules.filter((r) => r.id !== id)
    saveDb(db)
  },

  addUpload: async (upload: Omit<UploadHistory, 'id'>): Promise<UploadHistory> => {
    await delay(300)
    const db = getDb()
    const newUpload = { ...upload, id: Math.random().toString(36).substr(2, 9) }
    db.uploads.unshift(newUpload)
    saveDb(db)
    return newUpload
  },
}
