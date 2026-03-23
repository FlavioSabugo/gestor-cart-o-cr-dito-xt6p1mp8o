import { CreditCard, Transaction, CategorizationRule, UploadHistory } from '@/types/finance'

const DB_KEY = 'finance_db_v3'

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
  { id: 'r9', keyword: 'posto', category: 'Combustível' },
  { id: 'r10', keyword: 'shell', category: 'Combustível' },
  { id: 'r11', keyword: 'ipiranga', category: 'Combustível' },
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

const getDb = (): Database => {
  const data = localStorage.getItem(DB_KEY)
  if (data) return JSON.parse(data)
  return {
    cards: [MOCK_CARD],
    transactions: [],
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

  clearAllTransactions: async (): Promise<void> => {
    await delay(500)
    const db = getDb()
    db.transactions = []
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
