import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  CreditCard,
  ListOrdered,
  PieChart,
  FileUp,
  SplitSquareHorizontal,
  History,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Layout() {
  const location = useLocation()

  const navItems = [
    { href: '/', label: 'Visão Geral', icon: LayoutDashboard },
    { href: '/cards', label: 'Cartões', icon: CreditCard },
    { href: '/transactions', label: 'Transações', icon: ListOrdered },
    { href: '/analytics', label: 'Dashboard de Gastos', icon: PieChart },
    { href: '/statement', label: 'Importar Fatura', icon: FileUp },
    { href: '/rules', label: 'Regras', icon: SplitSquareHorizontal },
    { href: '/history', label: 'Histórico', icon: History },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar for Desktop / Topbar for Mobile */}
      <nav className="w-full md:w-64 bg-card border-b md:border-r border-border p-4 flex flex-col gap-2 shrink-0 md:sticky md:top-0 md:h-screen overflow-y-auto">
        <div className="font-bold text-xl mb-6 hidden md:block text-primary px-3 tracking-tight">
          Gestor CC
        </div>
        <div className="flex md:flex-col overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/' && location.pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors whitespace-nowrap',
                  isActive
                    ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-sm md:text-base font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-hidden">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
