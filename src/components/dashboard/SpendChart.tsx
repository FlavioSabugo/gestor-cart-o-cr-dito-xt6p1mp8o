import { useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { useFinance } from '@/stores/financeStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  amount: {
    label: 'Gastos R$',
    color: 'hsl(var(--primary))',
  },
}

export function SpendChart() {
  const { transactions } = useFinance()

  const data = useMemo(() => {
    // Generate last 7 days data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return {
        dateStr: d.toISOString().split('T')[0],
        display: new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(d),
        amount: 0,
      }
    })

    transactions.forEach((t) => {
      const tDate = t.date.split('T')[0]
      const day = last7Days.find((d) => d.dateStr === tDate)
      if (day) day.amount += t.amount
    })

    return last7Days
  }, [transactions])

  return (
    <Card className="col-span-1 lg:col-span-2 glass-effect shadow-subtle border-none">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Gastos nos últimos 7 dias</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="display"
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
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="var(--color-amount)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAmount)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
