import { useFinance } from '@/stores/financeStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { Utensils, Car, Coffee, ShoppingBag, HeartPulse, MoreHorizontal } from 'lucide-react'

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Alimentação':
      return <Utensils className="w-4 h-4" />
    case 'Transporte':
      return <Car className="w-4 h-4" />
    case 'Saúde':
      return <HeartPulse className="w-4 h-4 text-destructive" />
    case 'Compras':
      return <ShoppingBag className="w-4 h-4 text-primary" />
    case 'Serviços':
      return <Coffee className="w-4 h-4 text-orange-500" />
    default:
      return <MoreHorizontal className="w-4 h-4" />
  }
}

export function RecentList() {
  const { transactions, cards } = useFinance()
  const recent = transactions.slice(0, 5)

  return (
    <Card className="col-span-1 glass-effect shadow-subtle border-none">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Últimas Transações</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {recent.map((t) => {
          const card = cards.find((c) => c.id === t.cardId)
          return (
            <div key={t.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 bg-muted group-hover:bg-primary/10 transition-colors">
                  <AvatarFallback className="bg-transparent text-foreground">
                    {getCategoryIcon(t.category)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none mb-1">{t.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(t.date)}</span>
                    <span className="w-1 h-1 bg-border rounded-full" />
                    <span className="truncate max-w-[80px]">{card?.name}</span>
                  </div>
                </div>
              </div>
              <div className="font-semibold tabular-nums">{formatCurrency(t.amount)}</div>
            </div>
          )
        })}
        {recent.length === 0 && (
          <div className="text-center text-muted-foreground py-6">Nenhuma transação recente.</div>
        )}
      </CardContent>
    </Card>
  )
}
