import { useMemo, useState } from 'react'
import { useFinance } from '@/stores/financeStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw } from 'lucide-react'
import { formatCurrency } from '@/lib/formatters'
import { toast } from '@/hooks/use-toast'
import { Transaction } from '@/types/finance'
import { MONTHS } from '@/lib/constants'

export function RecurringSuggestions() {
  const { transactions, addTransaction, selectedMonth, selectedYear } = useFinance()
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set())

  const suggestions = useMemo(() => {
    const txByDesc = new Map<string, Transaction[]>()
    transactions.forEach((t) => {
      const arr = txByDesc.get(t.description) || []
      arr.push(t)
      txByDesc.set(t.description, arr)
    })

    const suggestionsList: Transaction[] = []
    const today = new Date()

    for (const [_, txs] of txByDesc.entries()) {
      if (txs.length < 2) continue

      const inCurrentMonth = txs.some((t) => {
        const m = t.billingMonth || t.date.substring(5, 7)
        const y = t.billingYear || t.date.substring(0, 4)
        return m === selectedMonth && y === selectedYear
      })
      if (inCurrentMonth) continue

      const sorted = [...txs].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
      const latest = sorted[0]

      const latestDate = new Date(latest.date)
      const monthsDiff =
        (today.getFullYear() - latestDate.getFullYear()) * 12 +
        (today.getMonth() - latestDate.getMonth())

      if (monthsDiff > 0 && monthsDiff <= 3) {
        suggestionsList.push(latest)
      }
    }

    return suggestionsList
  }, [transactions, selectedMonth, selectedYear])

  const handleConfirm = async (tx: Transaction) => {
    await addTransaction({
      description: tx.description,
      amount: tx.amount,
      category: tx.category,
      cardId: tx.cardId,
      date: new Date().toISOString(),
      billingMonth: selectedMonth,
      billingYear: selectedYear,
    })

    setConfirmed((prev) => new Set(prev).add(tx.id))

    const monthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label || selectedMonth

    toast({
      title: 'Recorrência Confirmada',
      description: `${tx.description} adicionado para a fatura de ${monthLabel}/${selectedYear}.`,
    })
  }

  const pendingSuggestions = suggestions.filter((s) => !confirmed.has(s.id))

  if (pendingSuggestions.length === 0) return null

  return (
    <Card className="glass-effect shadow-subtle border-primary/30 bg-primary/5 animate-fade-in-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-primary" />
          Sugestões de Recorrência
        </CardTitle>
        <CardDescription>
          Identificamos despesas recorrentes que ainda não estão na fatura selecionada.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {pendingSuggestions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between bg-background p-3 rounded-lg border shadow-sm"
          >
            <div>
              <p className="font-medium text-sm">{tx.description}</p>
              <p className="text-xs text-muted-foreground">
                {tx.category} • {formatCurrency(tx.amount)}
              </p>
            </div>
            <Button size="sm" onClick={() => handleConfirm(tx)} className="shrink-0 gap-1.5">
              <Plus className="w-4 h-4" /> Confirmar
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
