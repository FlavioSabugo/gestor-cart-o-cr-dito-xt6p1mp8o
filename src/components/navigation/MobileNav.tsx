import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, CreditCard, ReceiptText, PieChart } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { title: 'Início', icon: LayoutDashboard, path: '/' },
  { title: 'Cartões', icon: CreditCard, path: '/cards' },
  { title: 'Transações', icon: ReceiptText, path: '/transactions' },
  { title: 'Análises', icon: PieChart, path: '/analytics' },
]

export function MobileNav() {
  const location = useLocation()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.title}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <item.icon className={cn('w-5 h-5', isActive && 'fill-primary/20')} />
              <span className="text-[10px] font-medium">{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
