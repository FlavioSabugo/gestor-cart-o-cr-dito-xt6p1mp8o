import { useState } from 'react'
import { useFinance } from '@/stores/financeStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload } from 'lucide-react'
import { categorizeTransaction } from '@/lib/statementParser'
import { MONTHS } from '@/lib/constants'
import { toast } from '@/hooks/use-toast'

export function ImportStatementDialog() {
  const { cards, addTransactions, rules } = useFinance()
  const [open, setOpen] = useState(false)

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')
  const currentYear = new Date().getFullYear()
  const currentYearStr = String(currentYear)
  const YEARS = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString())

  const [text, setText] = useState('')
  const [cardId, setCardId] = useState('')
  const [billingMonth, setBillingMonth] = useState(currentMonth)
  const [billingYear, setBillingYear] = useState(currentYearStr)

  const handleImport = async () => {
    if (!cardId) {
      toast({
        title: 'Selecione um Cartão',
        description: 'É necessário selecionar um cartão para importar a fatura.',
        variant: 'destructive',
      })
      return
    }

    if (!text.trim()) {
      toast({
        title: 'Dados Vazios',
        description: 'Cole os dados da fatura para continuar.',
        variant: 'destructive',
      })
      return
    }

    const lines = text.split('\n')
    const validTxs = []

    for (const line of lines) {
      if (!line.trim()) continue
      const parts = line.split(',')

      if (parts.length >= 3) {
        const dateStr = parts[0].trim()
        const desc = parts[1].trim()
        const amountStr = parts[2].trim()
        const amount = parseFloat(amountStr)

        if (!isNaN(amount) && dateStr && desc) {
          let parsedDate = new Date(dateStr)
          if (isNaN(parsedDate.getTime())) {
            parsedDate = new Date() // fallback to today if invalid format
          }

          validTxs.push({
            date: parsedDate.toISOString(),
            description: desc,
            amount,
            category: categorizeTransaction(desc, rules),
            cardId,
            billingMonth,
            billingYear,
          })
        }
      }
    }

    if (validTxs.length === 0) {
      toast({
        title: 'Erro de Formato',
        description: 'Nenhuma transação válida encontrada. Use o formato: Data,Descrição,Valor',
        variant: 'destructive',
      })
      return
    }

    await addTransactions(validTxs, billingMonth, billingYear)
    setOpen(false)
    setText('')
  }

  const hasCards = cards.length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10"
        >
          <Upload className="w-4 h-4" /> Importar Fatura
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importação Rápida de Fatura</DialogTitle>
          <DialogDescription>
            Cole as transações no formato estruturado (CSV) para análise e categorização automática.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {!hasCards && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
              Você precisa adicionar um cartão de crédito antes de importar faturas.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mês da Fatura</Label>
              <Select value={billingMonth} onValueChange={setBillingMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ano da Fatura</Label>
              <Select value={billingYear} onValueChange={setBillingYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cartão de Destino</Label>
            <Select value={cardId} onValueChange={setCardId} disabled={!hasCards}>
              <SelectTrigger>
                <SelectValue placeholder={hasCards ? 'Selecione um cartão' : 'Nenhum cartão'} />
              </SelectTrigger>
              <SelectContent>
                {cards.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Dados da Fatura (CSV)</Label>
              <span className="text-xs text-muted-foreground">
                Formato: YYYY-MM-DD, Descrição, Valor
              </span>
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`2023-10-15, Uber Viagem, 25.90\n2023-10-16, Posto Ipiranga, 150.00\n2023-10-17, 99App, 14.50`}
              className="font-mono text-sm h-32"
              disabled={!hasCards}
            />
          </div>

          <Button
            onClick={handleImport}
            className="w-full"
            disabled={!hasCards || !text.trim() || !cardId}
          >
            Importar e Analisar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
