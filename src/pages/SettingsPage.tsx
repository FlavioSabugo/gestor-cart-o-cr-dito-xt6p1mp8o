import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/hooks/use-toast'

export default function SettingsPage() {
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
              onCheckedChange={(v) => {
                if (v) toast({ title: 'Notificações ativadas' })
              }}
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
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Limite Próximo</Label>
              <p className="text-sm text-muted-foreground">
                Avisar quando usar 80% do limite de um cartão.
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          onClick={() =>
            toast({
              title: 'Configurações salvas',
              description: 'Suas preferências foram atualizadas com sucesso.',
            })
          }
        >
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}
