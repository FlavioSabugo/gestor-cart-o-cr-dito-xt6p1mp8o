import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './navigation/AppSidebar'
import { TopHeader } from './navigation/TopHeader'
import { MobileNav } from './navigation/MobileNav'

export default function Layout() {
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
