import { useState, useEffect } from 'react'
import { useFinance } from '@/stores/financeStore'
import { CardBrand, CreditCard } from '@/types/finance'
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
import { CARD_COLORS } from '@/lib/constants'

export function EditCardDialog({
  card,
  children,
}: {
  card: CreditCard
  children: React.ReactNode
}) {
  const { updateCard } = useFinance()
  const [open, setOpen] = useState(false)

  const [name, setName] = useState(card.name)
  const [brand, setBrand] = useState<CardBrand>(card.brand)
  const [limit, setLimit] = useState(card.limit.toString())
  const [last4, setLast4] = useState(card.last4)
  const [closing, setClosing] = useState(card.closingDate.toString())
  const [due, setDue] = useState(card.dueDate.toString())
  const [color, setColor] = useState(card.color)

  useEffect(() => {
    if (open) {
      setName(card.name)
      setBrand(card.brand)
      setLimit(card.limit.toString())
      setLast4(card.last4)
      setClosing(card.closingDate.toString())
      setDue(card.dueDate.toString())
      setColor(card.color)
    }
  }, [open, card])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateCard(card.id, {
      name,
      brand,
      limit: parseFloat(limit),
      last4,
      closingDate: parseInt(closing),
      dueDate: parseInt(due),
      color,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Editar Cartão</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome do Cartão</Label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
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
              <Label htmlFor="edit-last4">Últimos 4 Dígitos</Label>
              <Input
                id="edit-last4"
                maxLength={4}
                value={last4}
                onChange={(e) => setLast4(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-limit">Limite Total (R$)</Label>
            <Input
              id="edit-limit"
              type="number"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-close">Dia Fechamento</Label>
              <Input
                id="edit-close"
                type="number"
                min="1"
                max="31"
                value={closing}
                onChange={(e) => setClosing(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-due">Dia Vencimento</Label>
              <Input
                id="edit-due"
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
              {CARD_COLORS.map((c) => (
                <div
                  key={c.name}
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full cursor-pointer ${c.value} ${color === c.value ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">
            Salvar Alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
