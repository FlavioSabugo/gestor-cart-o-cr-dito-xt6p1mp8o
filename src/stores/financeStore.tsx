import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import { CreditCard, Transaction, CardWithBalance } from '@/types/finance'
import { toast } from '@/hooks/use-toast'

interface FinanceState {
  cards: CreditCard[]
  transactions: Transaction[]
  cardsWithBalance: CardWithBalance[]
  addCard: (card: Omit<CreditCard, 'id'>) => void
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  deleteTransaction: (id: string) => void
  deleteCard: (id: string) => void
  globalLimit: number
  globalBalance: number
  globalAvailable: number
}

const FinanceContext = createContext<FinanceState | undefined>(undefined)

const MOCK_CARDS: CreditCard[] = [
  {
    id: '1',
    name: 'Nubank Principal',
    brand: 'mastercard',
    limit: 8000,
    closingDate: 5,
    dueDate: 12,
    color: 'bg-gradient-to-br from-purple-600 to-indigo-700',
    last4: '4321',
  },
  {
    id: '2',
    name: 'Itaú Personalité',
    brand: 'visa',
    limit: 15000,
    closingDate: 15,
    dueDate: 25,
    color: 'bg-gradient-to-br from-orange-500 to-amber-600',
    last4: '8876',
  },
  {
    id: '3',
    name: 'C6 Black',
    brand: 'mastercard',
    limit: 25000,
    closingDate: 1,
    dueDate: 10,
    color: 'bg-gradient-to-br from-gray-900 to-black',
    last4: '0012',
  },
]

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    date: new Date().toISOString(),
    description: 'Mercado Extra',
    amount: 450.5,
    category: 'Alimentação',
    cardId: '1',
  },
  {
    id: 't2',
    date: new Date(Date.now() - 86400000).toISOString(),
    description: 'Uber',
    amount: 25.9,
    category: 'Transporte',
    cardId: '1',
  },
  {
    id: 't3',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    description: 'Restaurante Outback',
    amount: 320.0,
    category: 'Alimentação',
    cardId: '2',
  },
  {
    id: 't4',
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    description: 'Netflix',
    amount: 39.9,
    category: 'Serviços',
    cardId: '1',
  },
  {
    id: 't5',
    date: new Date(Date.now() - 86400000 * 4).toISOString(),
    description: 'Posto Shell',
    amount: 200.0,
    category: 'Transporte',
    cardId: '3',
  },
  {
    id: 't6',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    description: 'Farmácia Pague Menos',
    amount: 85.4,
    category: 'Saúde',
    cardId: '2',
  },
  {
    id: 't7',
    date: new Date(Date.now() - 86400000 * 10).toISOString(),
    description: 'Amazon AWS',
    amount: 150.0,
    category: 'Serviços',
    cardId: '3',
  },
  {
    id: 't8',
    date: new Date(Date.now() - 86400000 * 15).toISOString(),
    description: 'Ingressos Cinema',
    amount: 90.0,
    category: 'Lazer',
    cardId: '1',
  },
]

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<CreditCard[]>(MOCK_CARDS)
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)

  const cardsWithBalance = useMemo(() => {
    return cards.map((card) => {
      const cardTx = transactions.filter((t) => t.cardId === card.id)
      const balance = cardTx.reduce((acc, curr) => acc + curr.amount, 0)
      const availableLimit = Math.max(0, card.limit - balance)
      const usagePercentage = Math.min(100, (balance / card.limit) * 100)
      return { ...card, balance, availableLimit, usagePercentage }
    })
  }, [cards, transactions])

  const globalLimit = useMemo(() => cards.reduce((acc, c) => acc + c.limit, 0), [cards])
  const globalBalance = useMemo(
    () => cardsWithBalance.reduce((acc, c) => acc + c.balance, 0),
    [cardsWithBalance],
  )
  const globalAvailable = Math.max(0, globalLimit - globalBalance)

  const addCard = (card: Omit<CreditCard, 'id'>) => {
    const newCard = { ...card, id: Math.random().toString(36).substr(2, 9) }
    setCards((prev) => [...prev, newCard])
    toast({ title: 'Cartão adicionado', description: `${card.name} foi adicionado com sucesso.` })
  }

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTx = { ...transaction, id: Math.random().toString(36).substr(2, 9) }
    setTransactions((prev) => [newTx, ...prev])
    toast({ title: 'Despesa registrada', description: `${transaction.description} foi salva.` })
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    toast({ title: 'Despesa removida' })
  }

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
    setTransactions((prev) => prev.filter((t) => t.cardId !== id))
    toast({ title: 'Cartão removido' })
  }

  return (
    <FinanceContext.Provider
      value={{
        cards,
        transactions,
        cardsWithBalance,
        addCard,
        addTransaction,
        deleteTransaction,
        deleteCard,
        globalLimit,
        globalBalance,
        globalAvailable,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) throw new Error('useFinance must be used within FinanceProvider')
  return context
}
