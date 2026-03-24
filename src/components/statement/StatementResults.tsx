import { useMemo, useState, useEffect } from 'react'
import { ParsedTransaction } from '@/lib/statementParser'
import { useFinance } from '@/stores/financeStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Save, Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { STANDARD_CATEGORIES } from '@/lib/constants'

interface StatementResultsProps {
  results: ParsedTransaction[]
  file: File
  cardId: string
  billingMonth: string
  billingYear: string
  onImportComplete: () => void
}

export function StatementResults({
  results: initialResults,
  file,
  cardId,
  billingMonth,
  billingYear,
  onImportComplete,
}: StatementResultsProps) {
  const { cards, addTransactions, addUpload, rules } = useFinance()
  const card = cards.find((c) => c.id === cardId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [results, setResults] = useState<ParsedTransaction[]>(initialResults)

  useEffect(() => {
    setResults(initialResults)
  }, [initialResults])

  const availableCategories = useMemo(() => {
    const cats = new Set(STANDARD_CATEGORIES)
    rules.forEach((r) => cats.add(r.category))
    results.forEach((r) => cats.add(r.category))
    return Array.from(cats).sort()
  }, [rules, results])

  const { totals, grandTotal } = useMemo(() => {
    const categoryTotals: Record<string, number> = {}
    let total = 0
    results.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
      total += t.amount
    })
    return { totals: categoryTotals, grandTotal: total }
  }, [results])

  const sortedCategories = Object.entries(totals)
    .filter(([_, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])

  const handleImport = async () => {
    setIsSubmitting(true)
    try {
      const newTransactions = results.map((t) => ({
        ...t,
        cardId,
        billingMonth,
        billingYear,
      }))
      await addTransactions(newTransactions, billingMonth, billingYear)

      await addUpload({
        filename: file.name,
        uploadDate: new Date().toISOString(),
        cardId,
        transactionCount: results.length,
        billingMonth,
        billingYear,
      })

      onImportComplete()
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateCategory = (index: number, newCategory: string) => {
    const newResults = [...results]
    newResults[index].category = newCategory
    setResults(newResults)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-subtle border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Salvar Transações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-background/50 border p-4 rounded-lg space-y-3 mb-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cartão Destino:</span>
                <span className="font-medium text-right">{card?.name || 'Desconhecido'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Mês/Ano Fatura:</span>
                <span className="font-medium text-right">
                  {billingMonth}/{billingYear}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transações:</span>
                <span className="font-medium text-right">{results.length}</span>
              </div>
            </div>
            <Button className="w-full" onClick={handleImport} disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Confirmar Importação
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle>Resumo por Categoria</CardTitle>
            <CardDescription>Distribuição inteligente e editável</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-lg mb-6">
              <span className="text-sm text-muted-foreground">Total Extraído</span>
              <span className="text-3xl font-bold text-primary">{formatCurrency(grandTotal)}</span>
            </div>

            <div className="space-y-4">
              {sortedCategories.map(([cat, amount]) => (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-muted-foreground">{cat}</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                  <Progress value={(amount / Math.max(grandTotal, 1)) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-2 shadow-subtle flex flex-col h-full">
        <CardHeader>
          <CardTitle>Transações Extraídas</CardTitle>
          <CardDescription>Revise e ajuste as categorias antes de salvar</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0 px-6 pb-6">
          <div className="rounded-md border h-[500px] overflow-auto">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((t, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDate(t.date)}
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate" title={t.description}>
                      {t.description}
                    </TableCell>
                    <TableCell>
                      <Select value={t.category} onValueChange={(val) => updateCategory(idx, val)}>
                        <SelectTrigger className="h-8 text-xs w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${t.amount < 0 ? 'text-green-600' : ''}`}
                    >
                      {formatCurrency(t.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
