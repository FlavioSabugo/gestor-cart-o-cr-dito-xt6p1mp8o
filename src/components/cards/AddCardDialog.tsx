import { useState } from 'react'
import { useFinance } from '@/stores/financeStore'
import { CardBrand } from '@/types/finance'
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

const COLORS = [
  { name: 'Roxo', value: 'bg-gradient-to-br from-purple-600 to-indigo-700' },
  { name: 'Laranja', value: 'bg-gradient-to-br from-orange-500 to-amber-600' },
  { name: 'Preto', value: 'bg-gradient-to-br from-gray-900 to-black' },
  { name: 'Azul', value: 'bg-gradient-to-br from-blue-500 to-cyan-600' },
  { name: 'Verde', value: 'bg-gradient-to-br from-emerald-500 to-teal-600' },
  { name: 'Vermelho', value: 'bg-gradient-to-br from-rose-500 to-red-600' },
]

export function AddCardDialog({ children }: { children?: React.ReactNode }) {
  const { addCard } = useFinance()
  const [open, setOpen] = useState(false)

  const [name, setName] = useState('')
  const [brand, setBrand] = useState<CardBrand>('mastercard')
  const [limit, setLimit] = useState('')
  const [last4, setLast4] = useState('')
  const [closing, setClosing] = useState('5')
  const [due, setDue] = useState('12')
  const [color, setColor] = useState(COLORS[0].value)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addCard({
      name,
      brand,
      limit: parseFloat(limit),
      last4,
      closingDate: parseInt(closing),
      dueDate: parseInt(due),
      color,
    })
    setOpen(false)
    setName('')
    setLimit('')
    setLast4('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Novo Cartão
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Cartão de Crédito</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cartão</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Nubank Principal"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bandeira</Label>
              <Select value={brand} onValueChange={(v) => setBrand(v as CardBrand)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mastercard">Mastercard</SelectItem>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="amex">Amex</SelectItem>
                  <SelectItem value="elo">Elo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="last4">Últimos 4 Dígitos</Label>
              <Input
                id="last4"
                maxLength={4}
                value={last4}
                onChange={(e) => setLast4(e.target.value)}
                placeholder="1234"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limit">Limite Total (R$)</Label>
            <Input
              id="limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="5000"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="close">Dia Fechamento</Label>
              <Input
                id="close"
                type="number"
                min="1"
                max="31"
                value={closing}
                onChange={(e) => setClosing(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due">Dia Vencimento</Label>
              <Input
                id="due"
                type="number"
                min="1"
                max="31"
                value={due}
                onChange={(e) => setDue(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cor do Cartão</Label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <div
                  key={c.name}
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full cursor-pointer ${c.value} ${color === c.value ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">
            Criar Cartão
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
