import { useState } from 'react'
import { useFinance } from '@/stores/financeStore'
import { formatCurrency, formatDate } from '@/lib/formatters'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Trash2, Search, Filter, Loader2 } from 'lucide-react'
import { AddTransactionDialog } from '@/components/transactions/AddTransactionDialog'
import { Badge } from '@/components/ui/badge'

export default function TransactionsPage() {
  const { transactions, cards, deleteTransaction } = useFinance()
  const [search, setSearch] = useState('')
  const [filterCard, setFilterCard] = useState('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    const matchesCard = filterCard === 'all' || t.cardId === filterCard
    return matchesSearch && matchesCard
  })

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteTransaction(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Todas Transações</h2>
          <p className="text-muted-foreground">Histórico completo de despesas.</p>
        </div>
        <AddTransactionDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border shadow-subtle">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar despesa..."
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterCard} onValueChange={setFilterCard}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Todos os Cartões" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Cartões</SelectItem>
              {cards.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden shadow-subtle">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="hidden md:table-cell">Categoria</TableHead>
              <TableHead className="hidden sm:table-cell">Cartão</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((t) => (
                <TableRow key={t.id} className="group transition-colors hover:bg-muted/30">
                  <TableCell className="whitespace-nowrap">{formatDate(t.date)}</TableCell>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary" className="font-normal">
                      {t.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {cards.find((c) => c.id === t.cardId)?.name}
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-medium">
                    {formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 text-destructive hover:bg-destructive/10 ${deletingId === t.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      disabled={deletingId === t.id}
                      onClick={() => handleDelete(t.id)}
                    >
                      {deletingId === t.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
