import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react'
import {
  CreditCard,
  Transaction,
  CardWithBalance,
  UploadHistory,
  CategorizationRule,
} from '@/types/finance'
import { toast } from '@/hooks/use-toast'
import { api } from '@/lib/api'

interface FinanceState {
  isLoading: boolean
  cards: CreditCard[]
  transactions: Transaction[]
  cardsWithBalance: CardWithBalance[]
  rules: CategorizationRule[]
  uploads: UploadHistory[]
  addCard: (card: Omit<CreditCard, 'id'>) => Promise<void>
  updateCard: (id: string, card: Omit<CreditCard, 'id'>) => Promise<void>
  deleteCard: (id: string) => Promise<void>
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>
  addTransactions: (transactions: Omit<Transaction, 'id'>[]) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  addRule: (rule: Omit<CategorizationRule, 'id'>) => Promise<void>
  deleteRule: (id: string) => Promise<void>
  addUpload: (upload: Omit<UploadHistory, 'id'>) => Promise<void>
  globalLimit: number
  globalBalance: number
  globalAvailable: number
}

const FinanceContext = createContext<FinanceState | undefined>(undefined)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [cards, setCards] = useState<CreditCard[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [rules, setRules] = useState<CategorizationRule[]>([])
  const [uploads, setUploads] = useState<UploadHistory[]>([])

  useEffect(() => {
    let mounted = true
    api.getInitialData().then((data) => {
      if (mounted) {
        setCards(data.cards)
        setTransactions(data.transactions)
        setRules(data.rules)
        setUploads(data.uploads)
        setIsLoading(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  const cardsWithBalance = useMemo(() => {
    return cards.map((card) => {
      const cardTx = transactions.filter((t) => t.cardId === card.id)
      const balance = cardTx.reduce((acc, curr) => acc + curr.amount, 0)
      const availableLimit = Math.max(0, card.limit - balance)
      const usagePercentage = Math.min(100, card.limit > 0 ? (balance / card.limit) * 100 : 0)
      return { ...card, balance, availableLimit, usagePercentage }
    })
  }, [cards, transactions])

  const globalLimit = useMemo(() => cards.reduce((acc, c) => acc + c.limit, 0), [cards])
  const globalBalance = useMemo(
    () => cardsWithBalance.reduce((acc, c) => acc + c.balance, 0),
    [cardsWithBalance],
  )
  const globalAvailable = Math.max(0, globalLimit - globalBalance)

  const addCard = async (card: Omit<CreditCard, 'id'>) => {
    const newCard = await api.addCard(card)
    setCards((prev) => [...prev, newCard])
    toast({ title: 'Cartão adicionado', description: `${card.name} foi adicionado com sucesso.` })
  }

  const updateCard = async (id: string, updated: Omit<CreditCard, 'id'>) => {
    const newCard = await api.updateCard(id, updated)
    setCards((prev) => prev.map((c) => (c.id === id ? newCard : c)))
    toast({
      title: 'Cartão atualizado',
      description: `As informações de ${updated.name} foram salvas.`,
    })
  }

  const deleteCard = async (id: string) => {
    await api.deleteCard(id)
    setCards((prev) => prev.filter((c) => c.id !== id))
    setTransactions((prev) => prev.filter((t) => t.cardId !== id))
    toast({ title: 'Cartão removido' })
  }

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTx = await api.addTransaction(transaction)
    setTransactions((prev) => [newTx, ...prev])
    toast({ title: 'Despesa registrada', description: `${transaction.description} foi salva.` })
  }

  const addTransactions = async (newTransactions: Omit<Transaction, 'id'>[]) => {
    const savedTxs = await api.addTransactions(newTransactions)
    setTransactions((prev) => [...savedTxs, ...prev])
    toast({
      title: 'Fatura Importada',
      description: `${newTransactions.length} despesas foram registradas com sucesso.`,
    })
  }

  const deleteTransaction = async (id: string) => {
    await api.deleteTransaction(id)
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    toast({ title: 'Despesa removida' })
  }

  const addRule = async (rule: Omit<CategorizationRule, 'id'>) => {
    const newRule = await api.addRule(rule)
    setRules((prev) => [...prev, newRule])
    toast({ title: 'Regra adicionada', description: `Palavra-chave: ${rule.keyword}` })
  }

  const deleteRule = async (id: string) => {
    await api.deleteRule(id)
    setRules((prev) => prev.filter((r) => r.id !== id))
    toast({ title: 'Regra removida' })
  }

  const addUpload = async (upload: Omit<UploadHistory, 'id'>) => {
    const newUpload = await api.addUpload(upload)
    setUploads((prev) => [newUpload, ...prev])
  }

  return (
    <FinanceContext.Provider
      value={{
        isLoading,
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
