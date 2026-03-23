import { useState, useEffect, useMemo } from 'react'
import { useFinance } from '@/stores/financeStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { formatCurrency } from '@/lib/formatters'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function MonthlyComparison() {
  const { transactions } = useFinance()

  const availableMonths = useMemo(() => {
    const months = new Set<string>()
    transactions.forEach((t) => {
      if (t.billingYear && t.billingMonth) {
        months.add(`${t.billingYear}-${t.billingMonth}`)
      }
    })
    return Array.from(months).sort((a, b) => b.localeCompare(a))
  }, [transactions])

  const [monthA, setMonthA] = useState<string>('')
  const [monthB, setMonthB] = useState<string>('')

  useEffect(() => {
    if (availableMonths.length > 0) {
      if (!monthA || !availableMonths.includes(monthA)) {
        setMonthA(availableMonths[0])
      }
      if (!monthB || !availableMonths.includes(monthB)) {
        setMonthB(availableMonths.length > 1 ? availableMonths[1] : availableMonths[0])
      }
    }
  }, [availableMonths, monthA, monthB])

  const comparisonData = useMemo(() => {
    if (!monthA || !monthB) return []

    const accA: Record<string, number> = {}
    const accB: Record<string, number> = {}
    const categories = new Set<string>()

    transactions.forEach((t) => {
      const mKey = `${t.billingYear}-${t.billingMonth}`
      if (mKey === monthA) {
        accA[t.category] = (accA[t.category] || 0) + t.amount
        categories.add(t.category)
      } else if (mKey === monthB) {
        accB[t.category] = (accB[t.category] || 0) + t.amount
        categories.add(t.category)
      }
    })

    return Array.from(categories)
      .map((cat) => {
        const valA = accA[cat] || 0
        const valB = accB[cat] || 0
        const diff = valA - valB
        const pct = valB > 0 ? (diff / valB) * 100 : valA > 0 ? 100 : 0

        return {
          category: cat,
          [monthA]: valA,
          [monthB]: valB,
          diff,
          pct,
        }
      })
      .sort((a, b) => b[monthA] - a[monthA] || b[monthB] - a[monthB])
  }, [transactions, monthA, monthB])

  if (availableMonths.length < 2) {
    return (
      <Card className="shadow-subtle border-none glass-effect mt-6">
        <CardHeader>
          <CardTitle>Comparativo Mensal</CardTitle>
          <CardDescription>
            É necessário ter transações em pelo menos 2 meses diferentes para visualizar a
            comparação.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const chartConfig = {
    valA: { label: `Mês ${monthA}`, color: 'hsl(var(--primary))' },
    valB: { label: `Mês ${monthB}`, color: 'hsl(var(--muted-foreground))' },
  }

  const chartData = comparisonData.slice(0, 6).map((d) => ({
    category: d.category,
    valA: d[monthA],
    valB: d[monthB],
  }))

  return (
    <Card className="shadow-subtle border-none glass-effect mt-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Comparativo Mensal</CardTitle>
            <CardDescription>Analise a evolução de gastos por categoria</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={monthA} onValueChange={setMonthA}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Mês A" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-sm">vs</span>
            <Select value={monthB} onValueChange={setMonthB}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Mês B" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `R$${v}`}
                    width={60}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'var(--muted)' }}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="valA" fill="var(--color-valA)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="valB" fill="var(--color-valB)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="rounded-md border bg-card/50 overflow-hidden overflow-y-auto max-h-[300px]">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Mês A</TableHead>
                  <TableHead className="text-right">Mês B</TableHead>
                  <TableHead className="text-right">Tendência</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row) => (
                  <TableRow key={row.category}>
                    <TableCell className="font-medium">{row.category}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row[monthA])}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row[monthB])}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {row.diff > 0 ? (
                          <TrendingUp className="w-4 h-4 text-destructive" />
                        ) : row.diff < 0 ? (
                          <TrendingDown className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Minus className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span
                          className={`text-sm ${row.diff > 0 ? 'text-destructive' : row.diff < 0 ? 'text-emerald-500' : 'text-muted-foreground'}`}
                        >
                          {row.diff > 0 ? '+' : ''}
                          {row.pct.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
