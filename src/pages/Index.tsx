import { SummaryCards } from '@/components/dashboard/SummaryCards'
import { SpendChart } from '@/components/dashboard/SpendChart'
import { RecentList } from '@/components/dashboard/RecentList'
import { CardCarousel } from '@/components/dashboard/CardCarousel'
import { AddTransactionDialog } from '@/components/transactions/AddTransactionDialog'
import { ImportStatementDialog } from '@/components/dashboard/ImportStatementDialog'
import { RecurringSuggestions } from '@/components/dashboard/RecurringSuggestions'
import { PeriodSelector } from '@/components/dashboard/PeriodSelector'

export default function Index() {
  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visão Geral</h2>
          <p className="text-muted-foreground">Acompanhe seus limites e faturas em tempo real.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <PeriodSelector />
          <ImportStatementDialog />
          <AddTransactionDialog />
        </div>
      </div>

      <SummaryCards />

      <RecurringSuggestions />

      <CardCarousel />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SpendChart />
        <RecentList />
      </div>
    </div>
  )
}
