import { useFinance } from '@/stores/financeStore'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'
import { Wallet, CreditCard, CalendarClock } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export function SummaryCards() {
  const { globalBalance, globalAvailable, globalLimit, cardsWithBalance } = useFinance()

  const usagePercent = globalLimit > 0 ? (globalBalance / globalLimit) * 100 : 0

  // Find nearest due date
  const today = new Date().getDate()
  const sortedCards = [...cardsWithBalance].sort((a, b) => {
    let dueA = a.dueDate >= today ? a.dueDate - today : a.dueDate + 30 - today
    let dueB = b.dueDate >= today ? b.dueDate - today : b.dueDate + 30 - today
    return dueA - dueB
  })

  const nextDueCard = sortedCards[0]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="glass-effect border-none shadow-subtle hover:shadow-elevation transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="w-5 h-5 text-destructive" />
              <h3 className="font-medium">Total Faturas</h3>
            </div>
          </div>
          <div className="text-3xl font-bold tabular-nums tracking-tight">
            {formatCurrency(globalBalance)}
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Progress value={usagePercent} className="h-2 flex-1" />
            <span>{usagePercent.toFixed(0)}% do limite</span>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-effect border-none shadow-subtle hover:shadow-elevation transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="w-5 h-5 text-success" />
              <h3 className="font-medium">Limite Disponível</h3>
            </div>
          </div>
          <div className="text-3xl font-bold tabular-nums tracking-tight text-success">
            {formatCurrency(globalAvailable)}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            De um total de {formatCurrency(globalLimit)}
          </p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-none shadow-subtle hover:shadow-elevation transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarClock className="w-5 h-5 text-primary" />
              <h3 className="font-medium">Próximo Vencimento</h3>
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight">
            Dia {nextDueCard?.dueDate || '--'}
          </div>
          <p className="text-sm text-muted-foreground mt-4 truncate">
            {nextDueCard
              ? `${nextDueCard.name} - Fatura: ${formatCurrency(nextDueCard.balance)}`
              : 'Nenhum cartão cadastrado'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
