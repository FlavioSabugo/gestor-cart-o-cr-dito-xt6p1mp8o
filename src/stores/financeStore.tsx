import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import {
  CreditCard,
  Transaction,
  CardWithBalance,
  UploadHistory,
  CategorizationRule,
} from '@/types/finance'
import { toast } from '@/hooks/use-toast'

interface FinanceState {
  cards: CreditCard[]
  transactions: Transaction[]
  cardsWithBalance: CardWithBalance[]
  rules: CategorizationRule[]
  uploads: UploadHistory[]
  addCard: (card: Omit<CreditCard, 'id'>) => void
  updateCard: (id: string, card: Omit<CreditCard, 'id'>) => void
  deleteCard: (id: string) => void
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  addTransactions: (transactions: Omit<Transaction, 'id'>[]) => void
  deleteTransaction: (id: string) => void
  addRule: (rule: Omit<CategorizationRule, 'id'>) => void
  deleteRule: (id: string) => void
  addUpload: (upload: Omit<UploadHistory, 'id'>) => void
  globalLimit: number
  globalBalance: number
  globalAvailable: number
}

const FinanceContext = createContext<FinanceState | undefined>(undefined)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<CreditCard[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [rules, setRules] = useState<CategorizationRule[]>([])
  const [uploads, setUploads] = useState<UploadHistory[]>([])

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

  const updateCard = (id: string, updated: Omit<CreditCard, 'id'>) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...updated, id } : c)))
    toast({
      title: 'Cartão atualizado',
      description: `As informações de ${updated.name} foram salvas.`,
    })
  }

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
    setTransactions((prev) => prev.filter((t) => t.cardId !== id))
    toast({ title: 'Cartão removido' })
  }

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTx = { ...transaction, id: Math.random().toString(36).substr(2, 9) }
    setTransactions((prev) => [newTx, ...prev])
    toast({ title: 'Despesa registrada', description: `${transaction.description} foi salva.` })
  }

  const addTransactions = (newTransactions: Omit<Transaction, 'id'>[]) => {
    const txsWithIds = newTransactions.map((t) => ({
      ...t,
      id: Math.random().toString(36).substr(2, 9),
    }))
    setTransactions((prev) => [...txsWithIds, ...prev])
    toast({
      title: 'Fatura Importada',
      description: `${newTransactions.length} despesas foram registradas com sucesso.`,
    })
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    toast({ title: 'Despesa removida' })
  }

  const addRule = (rule: Omit<CategorizationRule, 'id'>) => {
    setRules((prev) => [...prev, { ...rule, id: Math.random().toString(36).substr(2, 9) }])
    toast({ title: 'Regra adicionada', description: `Palavra-chave: ${rule.keyword}` })
  }

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id))
    toast({ title: 'Regra removida' })
  }

  const addUpload = (upload: Omit<UploadHistory, 'id'>) => {
    setUploads((prev) => [{ ...upload, id: Math.random().toString(36).substr(2, 9) }, ...prev])
  }

  return (
    <FinanceContext.Provider
      value={{
        cards,
        transactions,
        cardsWithBalance,
        rules,
        uploads,
        addCard,
        updateCard,
        deleteCard,
        addTransaction,
        addTransactions,
        deleteTransaction,
        addRule,
        deleteRule,
        addUpload,
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
