import { useFinance } from '@/stores/financeStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { toast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'
import { SlidersHorizontal, FileText, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  const { clearAllTransactions } = useFinance()

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie suas preferências e perfil.</p>
      </div>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle>Perfil de Usuário</CardTitle>
          <CardDescription>Informações básicas da sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4"
              alt="User"
            />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">Usuário Demo</h3>
            <p className="text-muted-foreground">usuario.demo@exemplo.com</p>
            <Button variant="outline" size="sm" className="mt-2">
              Editar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle>Gerenciamento de Dados</CardTitle>
          <CardDescription>Acesse painéis de controle avançados.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start font-medium" asChild>
            <Link to="/rules">
              <SlidersHorizontal className="w-4 h-4 mr-2 text-primary" />
              Regras de Categorização Automática
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start font-medium" asChild>
            <Link to="/history">
              <FileText className="w-4 h-4 mr-2 text-primary" />
              Histórico de Faturas Importadas
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>Escolha como deseja ser avisado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Alertas de Vencimento</Label>
              <p className="text-sm text-muted-foreground">
                Receba um aviso 3 dias antes da fatura vencer.
              </p>
            </div>
            <Switch
              defaultChecked
              onCheckedChange={(v) => v && toast({ title: 'Notificações ativadas' })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Resumo Semanal</Label>
              <p className="text-sm text-muted-foreground">
                Email com o resumo dos seus gastos da semana.
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-subtle border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Zona de Perigo
          </CardTitle>
          <CardDescription>Ações irreversíveis para a sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Limpar Dados de Transações</Label>
              <p className="text-sm text-muted-foreground">
                Remove permanentemente todas as transações, zerando o histórico.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="shrink-0">
                  Apagar Tudo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso irá deletar permanentemente todas as suas
                    transações e faturas importadas, zerando o histórico analítico de todos os
                    meses.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => clearAllTransactions()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sim, apagar tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          onClick={() =>
            toast({
              title: 'Configurações salvas',
              description: 'Suas preferências foram atualizadas.',
            })
          }
        >
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}
