export type CardBrand = 'mastercard' | 'visa' | 'amex' | 'elo'

export type TransactionCategory = string

export interface CreditCard {
  id: string
  name: string
  brand: CardBrand
  limit: number
  closingDate: number
  dueDate: number
  color: string
  last4: string
}

export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  category: TransactionCategory
  cardId: string
  installments?: {
    current: number
    total: number
  }
}

export interface CardWithBalance extends CreditCard {
  balance: number
  availableLimit: number
  usagePercentage: number
}

export interface UploadHistory {
  id: string
  filename: string
  uploadDate: string
  cardId: string
  transactionCount: number
}

export interface CategorizationRule {
  id: string
  keyword: string
  category: TransactionCategory
}
