import { Bell, User, Search } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLocation } from 'react-router-dom'

const routeTitles: Record<string, string> = {
  '/': 'Visão Geral',
  '/cards': 'Meus Cartões',
  '/transactions': 'Transações',
  '/analytics': 'Análise de Gastos',
  '/settings': 'Configurações',
}

export function TopHeader() {
  const location = useLocation()
  const title = routeTitles[location.pathname] || 'Gestor de Crédito'

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 h-16 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden md:flex relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-full bg-muted/50 border-none pl-9 rounded-full focus-visible:ring-1"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/50 transition-all">
          <AvatarImage
            src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4"
            alt="User"
          />
          <AvatarFallback>US</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
