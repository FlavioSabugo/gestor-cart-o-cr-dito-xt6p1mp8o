import { useMemo } from 'react'
import { useFinance } from '@/stores/financeStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { formatCurrency } from '@/lib/formatters'
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react'

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--primary))',
  '#f59e0b',
  '#10b981',
  '#8b5cf6',
  '#6366f1',
  '#ec4899',
  '#64748b',
]

export default function AnalyticsPage() {
  const { periodTransactions, cards, selectedMonth, selectedYear } = useFinance()

  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {}
    periodTransactions.forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount
    })

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [periodTransactions])

  const cardData = useMemo(() => {
    const totals: Record<string, number> = {}
    periodTransactions.forEach((t) => {
      totals[t.cardId] = (totals[t.cardId] || 0) + t.amount
    })

    return Object.entries(totals)
      .map(([cardId, value]) => {
        const card = cards.find((c) => c.id === cardId)
        return {
          name: card ? card.name : 'Desconhecido',
          value,
        }
      })
      .sort((a, b) => b.value - a.value)
  }, [periodTransactions, cards])

  const totalPeriod = periodTransactions.reduce((acc, t) => acc + t.amount, 0)

  const chartConfig = {
    value: {
      label: 'Gasto',
      color: 'hsl(var(--primary))',
    },
  }

  if (periodTransactions.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard de Gastos</h2>
        <Card className="flex flex-col items-center justify-center py-24 text-center border-dashed">
          <PieChartIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sem dados para este período</h3>
          <p className="text-muted-foreground max-w-sm">
            Importe uma fatura ou adicione transações para visualizar o resumo de gastos de{' '}
            {selectedMonth}/{selectedYear}.
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in pb-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard de Gastos</h2>
        <p className="text-muted-foreground">
          Análise visual das suas despesas para o período selecionado.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-subtle">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Gastos por Categoria
            </CardTitle>
            <CardDescription>
              Distribuição do total de {formatCurrency(totalPeriod)}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Gastos por Cartão
            </CardTitle>
            <CardDescription>Volume de despesas concentradas em cada cartão</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cardData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--muted-foreground)/0.2)"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `R$ ${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                    formatter={(value: number) => [formatCurrency(value), 'Total']}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {cardData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
