import { useState } from 'react'
import { useFinance } from '@/stores/financeStore'
import { VirtualCard } from '@/components/shared/VirtualCard'
import { AddCardDialog } from '@/components/cards/AddCardDialog'
import { EditCardDialog } from '@/components/cards/EditCardDialog'
import { Button } from '@/components/ui/button'
import { Trash2, FileUp, Edit, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function CardsPage() {
  const { cardsWithBalance, deleteCard } = useFinance()
  const navigate = useNavigate()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteCard(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Meus Cartões</h2>
          <p className="text-muted-foreground">Gerencie seus limites e dias de vencimento.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link to="/statement">
              <FileUp className="w-4 h-4 mr-2" /> Importar Fatura
            </Link>
          </Button>
          <AddCardDialog />
        </div>
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
            Adicione seu primeiro cartão de crédito para começar a gerenciar seus gastos reais.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <AddCardDialog />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardsWithBalance.map((card) => (
            <div key={card.id} className="relative group">
              <VirtualCard
                card={card}
                className="w-full max-w-md mx-auto"
                onClick={() => navigate(`/cards/${card.id}`)}
              />

              <div className="absolute -top-3 -right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <EditCardDialog card={card}>
                  <Button variant="secondary" size="icon" className="rounded-full shadow-md">
                    <Edit className="w-4 h-4" />
                  </Button>
                </EditCardDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="rounded-full shadow-md"
                      disabled={deletingId === card.id}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {deletingId === card.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir cartão?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza de que deseja excluir o cartão <strong>{card.name}</strong>?
                        Esta ação não pode ser desfeita e removerá todas as transações associadas a
                        ele.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(card.id)
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Sim, excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

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
