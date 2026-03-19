import { useMemo } from 'react'
import { useFinance } from '@/stores/financeStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  total: { label: 'Gasto Total', color: 'hsl(var(--primary))' },
}

export function MonthlyEvolutionChart() {
  const { transactions } = useFinance()

  const data = useMemo(() => {
    const result = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

      const total = transactions
        .filter((t) => t.date.startsWith(monthKey))
        .reduce((sum, t) => sum + t.amount, 0)

      result.push({
        name: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        total,
      })
    }
    return result
  }, [transactions])

  return (
    <Card className="shadow-subtle border-none glass-effect mt-6">
      <CardHeader>
        <CardTitle>Evolução de Gastos (Últimos 6 meses)</CardTitle>
        <CardDescription>Comparativo de todos os cartões</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `R$${v}`}
                width={60}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--muted)' }} />
              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
