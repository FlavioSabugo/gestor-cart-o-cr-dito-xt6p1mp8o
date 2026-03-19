export type CardBrand = 'mastercard' | 'visa' | 'amex' | 'elo'

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

export type TransactionCategory =
  | 'Alimentação'
  | 'Transporte'
  | 'Lazer'
  | 'Saúde'
  | 'Educação'
  | 'Compras'
  | 'Serviços'
  | 'Outros'

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
