import { useFinance } from '@/stores/financeStore'
import { VirtualCard } from '@/components/shared/VirtualCard'
import { AddCardDialog } from '@/components/cards/AddCardDialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export default function CardsPage() {
  const { cardsWithBalance, deleteCard } = useFinance()

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Meus Cartões</h2>
          <p className="text-muted-foreground">Gerencie seus limites e dias de vencimento.</p>
        </div>
        <AddCardDialog />
      </div>

      {cardsWithBalance.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <img
            src="https://img.usecurling.com/i?q=credit-card&shape=lineal-color&color=blue"
            alt="No cards"
            className="w-32 h-32 mb-4 opacity-80"
          />
          <h3 className="text-xl font-semibold">Nenhum cartão encontrado</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Adicione seu primeiro cartão de crédito para começar a gerenciar seus gastos.
          </p>
          <div className="mt-6">
            <AddCardDialog />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardsWithBalance.map((card) => (
            <div key={card.id} className="relative group">
              <VirtualCard card={card} className="w-full max-w-md mx-auto" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-20 shadow-md"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteCard(card.id)
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <div className="mt-4 px-2 space-y-2 text-sm max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Limite Total:</span>
                  <span className="font-medium">R$ {card.limit.toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Melhor dia compra:</span>
                  <span className="font-medium text-success">Dia {card.closingDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
