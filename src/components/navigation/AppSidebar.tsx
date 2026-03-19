import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  CreditCard,
  ReceiptText,
  PieChart,
  Settings,
  Wallet,
  FileUp,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'

const mainNavItems = [
  { title: 'Início', icon: LayoutDashboard, path: '/' },
  { title: 'Meus Cartões', icon: CreditCard, path: '/cards' },
  { title: 'Transações', icon: ReceiptText, path: '/transactions' },
  { title: 'Importar Fatura', icon: FileUp, path: '/statement' },
  { title: 'Análises', icon: PieChart, path: '/analytics' },
]

const bottomNavItems = [{ title: 'Configurações', icon: Settings, path: '/settings' }]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar variant="inset" className="border-r border-border hidden md:flex">
      <SidebarHeader className="p-4 flex items-center gap-2 font-bold text-xl text-primary mt-2">
        <Wallet className="w-6 h-6" />
        <span>GestorCard</span>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 gap-4">
        <SidebarMenu>
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link to={item.path} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                <Link to={item.path} className="flex items-center gap-3 text-muted-foreground">
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
