import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './navigation/AppSidebar'
import { TopHeader } from './navigation/TopHeader'
import { MobileNav } from './navigation/MobileNav'
import { useFinance } from '@/stores/financeStore'
import { Loader2 } from 'lucide-react'

export default function Layout() {
  const { isLoading } = useFinance()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse font-medium">
            Conectando ao Supabase e carregando dados...
          </p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background selection:bg-primary/20">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 w-full relative">
          <TopHeader />
          <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-x-hidden animate-fade-in">
            <Outlet />
          </main>
        </SidebarInset>
        <MobileNav />
      </div>
    </SidebarProvider>
  )
}
