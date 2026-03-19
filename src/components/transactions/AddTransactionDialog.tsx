import { useState } from 'react'
import { useFinance } from '@/stores/financeStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { STANDARD_CATEGORIES } from '@/lib/constants'

export function AddTransactionDialog() {
  const { cards, transactions, rules, addTransaction } = useFinance()
  const [open, setOpen] = useState(false)

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Outros')
  const [cardId, setCardId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  // Combine standard, rule and existing categories to allow flexibility
  const allCategories = Array.from(
    new Set([
      ...STANDARD_CATEGORIES,
      ...transactions.map((t) => t.category),
      ...rules.map((r) => r.category),
    ]),
  ).sort()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount || !cardId || !date) return

    addTransaction({
      description,
      amount: parseFloat(amount.replace(',', '.')),
      category,
      cardId,
      date: new Date(date).toISOString(),
    })

    setOpen(false)
    setDescription('')
    setAmount('')
    setCategory('Outros')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg group">
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Nova Despesa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Nova Despesa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="desc">Descrição</Label>
            <Input
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Almoço"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cartão</Label>
            <Select value={cardId} onValueChange={setCardId} required disabled={cards.length === 0}>
              <SelectTrigger>
                <SelectValue
                  placeholder={cards.length > 0 ? 'Selecione um cartão' : 'Nenhum cartão'}
                />
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
            <Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={cards.length === 0}>
            Salvar Transação
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
