import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useFinance } from '@/stores/financeStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { ArrowLeft, Edit, Trash2, Loader2, XCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { VirtualCard } from '@/components/shared/VirtualCard'
import { EditCardDialog } from '@/components/cards/EditCardDialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export default function CardDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { cardsWithBalance, transactions, deleteCard, deleteTransaction } = useFinance()
  const [isDeletingCard, setIsDeletingCard] = useState(false)
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null)

  const card = cardsWithBalance.find((c) => c.id === id)

  const cardTransactions = useMemo(
    () => transactions.filter((t) => t.cardId === id),
    [transactions, id],
  )

  const availableMonths = useMemo(() => {
    const months = new Set(
      cardTransactions.map((t) => {
        if (t.billingYear && t.billingMonth) {
          return `${t.billingYear}-${t.billingMonth.padStart(2, '0')}`
        }
        return t.date.substring(0, 7)
      }),
    )
    const sorted = Array.from(months).sort().reverse()
    if (sorted.length === 0) {
      const now = new Date()
      sorted.push(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
    }
    return sorted
  }, [cardTransactions])

  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0])

  useEffect(() => {
    if (!availableMonths.includes(selectedMonth) && availableMonths.length > 0) {
      setSelectedMonth(availableMonths[0])
    }
  }, [availableMonths, selectedMonth])

  const monthTransactions = useMemo(() => {
    return cardTransactions
      .filter((t) => {
        if (t.billingYear && t.billingMonth) {
          return `${t.billingYear}-${t.billingMonth.padStart(2, '0')}` === selectedMonth
        }
        return t.date.startsWith(selectedMonth)
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [cardTransactions, selectedMonth])

  const categoryData = useMemo(() => {
    const acc: Record<string, number> = {}
    monthTransactions.forEach((t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
    })
    return Object.keys(acc)
      .map((key, i) => ({
        name: key,
        value: acc[key],
        fill: COLORS[i % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
  }, [monthTransactions])

  const handleDeleteCard = async () => {
    if (!card) return
    setIsDeletingCard(true)
    try {
      await deleteCard(card.id)
      navigate('/cards')
    } finally {
      setIsDeletingCard(false)
    }
  }

  const handleDeleteTx = async (txId: string) => {
    setDeletingTxId(txId)
    try {
      await deleteTransaction(txId)
    } finally {
      setDeletingTxId(null)
    }
  }

  if (!card)
    return <div className="p-8 text-center text-muted-foreground">Cartão não encontrado.</div>

  const formatMonth = (str: string) => {
    const [y, m] = str.split('-')
    const date = new Date(parseInt(y), parseInt(m) - 1)
    return date
      .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      .replace(/^\w/, (c) => c.toUpperCase())
  }

  const monthTotal = monthTransactions.reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/cards">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Fatura do Cartão</h2>
            <p className="text-muted-foreground">Acompanhe seus gastos mês a mês.</p>
          </div>
        </div>

        <div className="sm:ml-auto flex items-center gap-2">
          <EditCardDialog card={card}>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </EditCardDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" disabled={isDeletingCard}>
                {isDeletingCard ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir cartão?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza de que deseja excluir o cartão <strong>{card.name}</strong>? Esta ação
                  não pode ser desfeita e removerá todas as transações associadas a ele.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteCard}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sim, excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex justify-center md:justify-start">
          <VirtualCard card={card} className="cursor-default hover:-translate-y-0" />
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-subtle h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Resumo: {formatMonth(selectedMonth)}</CardTitle>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((m) => (
                    <SelectItem key={m} value={m}>
                      {formatMonth(m)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm text-muted-foreground mb-1">Total da Fatura</p>
                <div className="text-4xl font-bold text-primary">{formatCurrency(monthTotal)}</div>
              </div>
              {categoryData.length > 0 && (
                <div className="h-[180px] flex-1 w-full min-w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v: number) => `R$ ${v.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle>Transações de {formatMonth(selectedMonth)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {monthTransactions.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center py-3 border-b last:border-0 hover:bg-muted/30 px-2 rounded transition-colors group"
              >
                <div>
                  <p className="font-medium">{t.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(t.date)} •{' '}
                    <span className="font-medium text-foreground/70">{t.category}</span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{formatCurrency(t.amount)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity ${deletingTxId === t.id ? 'opacity-100' : ''}`}
                    onClick={() => handleDeleteTx(t.id)}
                    disabled={deletingTxId === t.id}
                  >
                    {deletingTxId === t.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
            {monthTransactions.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Nenhuma transação nesta fatura.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
