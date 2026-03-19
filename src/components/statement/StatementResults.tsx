import { useState, useMemo } from 'react'
import { ParsedTransaction } from '@/lib/statementParser'
import { useFinance } from '@/stores/financeStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/formatters'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Save, AlertCircle } from 'lucide-react'

interface StatementResultsProps {
  results: ParsedTransaction[]
  file: File
  onImportComplete: () => void
}

export function StatementResults({ results, file, onImportComplete }: StatementResultsProps) {
  const { cards, addTransactions, addUpload } = useFinance()
  const [selectedCard, setSelectedCard] = useState<string>('')

  const { totals, grandTotal } = useMemo(() => {
    const categoryTotals: Record<string, number> = {}
    let total = 0
    results.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
      total += t.amount
    })
    return { totals: categoryTotals, grandTotal: total }
  }, [results])

  const sortedCategories = Object.entries(totals).sort((a, b) => b[1] - a[1])

  const handleImport = () => {
    if (!selectedCard) return
    const newTransactions = results.map((t) => ({ ...t, cardId: selectedCard }))
    addTransactions(newTransactions)

    addUpload({
      filename: file.name,
      uploadDate: new Date().toISOString(),
      cardId: selectedCard,
      transactionCount: results.length,
    })

    onImportComplete()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-subtle border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Salvar Transações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedCard} onValueChange={setSelectedCard}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecione o cartão de destino" />
              </SelectTrigger>
              <SelectContent>
                {cards.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} (•••• {c.last4})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button className="w-full" onClick={handleImport} disabled={!selectedCard}>
              <Save className="w-4 h-4 mr-2" />
              Importar {results.length} Despesas
            </Button>
            {!selectedCard && (
              <p className="text-xs flex items-center text-muted-foreground mt-2">
                <AlertCircle className="w-3 h-3 mr-1" />
                Selecione um cartão para habilitar o botão
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle>Resumo por Categoria</CardTitle>
            <CardDescription>Distribuição aplicada com regras</CardDescription>
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
                  <Progress value={(amount / grandTotal) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-2 shadow-subtle flex flex-col h-full">
        <CardHeader>
          <CardTitle>Transações Extraídas</CardTitle>
          <CardDescription>Arquivo: {file.name}</CardDescription>
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
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {t.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
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
