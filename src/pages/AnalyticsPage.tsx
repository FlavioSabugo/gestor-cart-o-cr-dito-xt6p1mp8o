import { useMemo } from 'react'
import { useFinance } from '@/stores/financeStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  '#10B981',
  '#F59E0B',
]

export default function AnalyticsPage() {
  const { transactions, cards } = useFinance()

  const categoryData = useMemo(() => {
    const acc: Record<string, number> = {}
    transactions.forEach((t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
    })
    return Object.keys(acc)
      .map((key, index) => ({
        name: key,
        value: acc[key],
        fill: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const cardUsageData = useMemo(() => {
    const acc: Record<string, number> = {}
    transactions.forEach((t) => {
      acc[t.cardId] = (acc[t.cardId] || 0) + t.amount
    })
    return Object.keys(acc).map((key) => ({
      name: cards.find((c) => c.id === key)?.name || 'Unknown',
      total: acc[key],
    }))
  }, [transactions, cards])

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Análise de Gastos</h2>
        <p className="text-muted-foreground">Entenda para onde seu dinheiro está indo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-subtle border-none glass-effect">
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground">Sem dados suficientes.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-subtle border-none glass-effect">
          <CardHeader>
            <CardTitle>Uso por Cartão</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {cardUsageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cardUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `R$${val}`}
                    width={60}
                  />
                  <Tooltip
                    formatter={(value: number) => `R$ ${value.toFixed(2)}`}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  />
                  <Bar
                    dataKey="total"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Sem dados.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
