import { createClient } from '@supabase/supabase-js'
import { CreditCard, Transaction, CategorizationRule, UploadHistory } from '@/types/finance'
import { toast } from '@/hooks/use-toast'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseKey)

const DEFAULT_RULES: CategorizationRule[] = [
  { id: 'r1', keyword: 'uber', category: 'Transporte' },
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
  { id: 'r12', keyword: 'metrô', category: 'Transporte' },
  { id: 'r13', keyword: 'metro', category: 'Transporte' },
]

const handleError = (error: any, action: string) => {
  console.error(`Error during ${action}:`, error)
  toast({
    title: 'Erro de Conexão',
    description: `Não foi possível ${action}. Verifique sua conexão com o Supabase.`,
    variant: 'destructive',
  })
  throw error
}

export const api = {
  getInitialData: async () => {
    try {
      const [cardsRes, txRes, rulesRes, uploadsRes] = await Promise.all([
        supabase.from('cards').select('*'),
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('rules').select('*'),
        supabase.from('uploads').select('*').order('uploadDate', { ascending: false }),
      ])

      if (cardsRes.error || txRes.error || rulesRes.error || uploadsRes.error) {
        throw new Error('Database fetch error')
      }

      let rules = rulesRes.data || []
      if (rules.length === 0) {
        rules = DEFAULT_RULES
      }

      return {
        cards: (cardsRes.data || []) as CreditCard[],
        transactions: (txRes.data || []) as Transaction[],
        rules: rules as CategorizationRule[],
        uploads: (uploadsRes.data || []) as UploadHistory[],
      }
    } catch (error) {
      console.error('Error fetching initial data:', error)
      toast({
        title: 'Erro de Sincronização',
        description:
          'Não foi possível carregar os dados do banco. Verifique as credenciais do Supabase.',
        variant: 'destructive',
      })
      return { cards: [], transactions: [], rules: DEFAULT_RULES, uploads: [] }
    }
  },

  getTransactionsByPeriod: async (month: string, year: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('billingMonth', month)
        .eq('billingYear', year)
        .order('date', { ascending: false })

      if (error) throw error
      return { data: data as Transaction[], error: null }
    } catch (error) {
      console.error('Error fetching period transactions:', error)
      return { data: [], error }
    }
  },

  addCard: async (card: Omit<CreditCard, 'id'>): Promise<CreditCard> => {
    const { data, error } = await supabase.from('cards').insert([card]).select().single()
    if (error) handleError(error, 'salvar o cartão')
    return data as CreditCard
  },

  updateCard: async (id: string, updated: Omit<CreditCard, 'id'>): Promise<CreditCard> => {
    const { data, error } = await supabase
      .from('cards')
      .update(updated)
      .eq('id', id)
      .select()
      .single()
    if (error) handleError(error, 'atualizar o cartão')
    return data as CreditCard
  },

  deleteCard: async (id: string): Promise<void> => {
    const { error } = await supabase.from('cards').delete().eq('id', id)
    if (error) handleError(error, 'excluir o cartão')
  },

  addTransaction: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single()
    if (error) handleError(error, 'salvar a transação')
    return data as Transaction
  },

  addTransactions: async (transactions: Omit<Transaction, 'id'>[]): Promise<Transaction[]> => {
    const { data, error } = await supabase.from('transactions').insert(transactions).select()
    if (error) handleError(error, 'importar as transações')
    return data as Transaction[]
  },

  deleteTransaction: async (id: string): Promise<void> => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) handleError(error, 'excluir a transação')
  },

  clearAllTransactions: async (): Promise<void> => {
    const { error: txError } = await supabase.from('transactions').delete().not('id', 'is', null)
    if (txError) handleError(txError, 'limpar as transações')

    const { error: upError } = await supabase.from('uploads').delete().not('id', 'is', null)
    if (upError) handleError(upError, 'limpar os uploads')
  },

  addRule: async (rule: Omit<CategorizationRule, 'id'>): Promise<CategorizationRule> => {
    const { data, error } = await supabase.from('rules').insert([rule]).select().single()
    if (error) handleError(error, 'salvar a regra')
    return data as CategorizationRule
  },

  deleteRule: async (id: string): Promise<void> => {
    const { error } = await supabase.from('rules').delete().eq('id', id)
    if (error) handleError(error, 'excluir a regra')
  },

  addUpload: async (upload: Omit<UploadHistory, 'id'>): Promise<UploadHistory> => {
    const { data, error } = await supabase.from('uploads').insert([upload]).select().single()
    if (error) handleError(error, 'salvar o histórico')
    return data as UploadHistory
  },
}
