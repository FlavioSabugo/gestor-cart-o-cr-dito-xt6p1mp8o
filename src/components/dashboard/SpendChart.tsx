import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { useFinance } from '@/stores/financeStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { MONTHS } from '@/lib/constants'

const chartConfig = {
  amount: {
    label: 'Gastos R$',
    color: 'hsl(var(--primary))',
  },
}

export function SpendChart() {
  const { periodTransactions, selectedMonth, selectedYear } = useFinance()

  const monthLabel = MONTHS.find((m) => m.value === selectedMonth)?.label || selectedMonth

  const data = useMemo(() => {
    const acc: Record<string, number> = {}
    periodTransactions.forEach((t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
    })

    return Object.keys(acc)
      .map((key) => ({
        category: key,
        amount: acc[key],
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)
  }, [periodTransactions])

  return (
    <Card className="col-span-1 lg:col-span-2 glass-effect shadow-subtle border-none">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Gastos por Categoria</CardTitle>
        <CardDescription>
          {monthLabel} de {selectedYear}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="category"
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
                  dx={-10}
                />
                <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: 'var(--muted)' }} />
                <Bar
                  dataKey="amount"
                  fill="var(--color-amount)"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-[250px] flex items-center justify-center text-muted-foreground">
            Nenhuma transação neste período.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
