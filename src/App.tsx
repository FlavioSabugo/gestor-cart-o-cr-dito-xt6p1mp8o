import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { FinanceProvider } from '@/stores/financeStore'

import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import Index from './pages/Index'
import CardsPage from './pages/CardsPage'
import CardDetailsPage from './pages/CardDetailsPage'
import TransactionsPage from './pages/TransactionsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import SettingsPage from './pages/SettingsPage'
import StatementUploadPage from './pages/StatementUploadPage'
import RulesPage from './pages/RulesPage'
import UploadHistoryPage from './pages/UploadHistoryPage'

const App = () => (
  <FinanceProvider>
    <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/cards" element={<CardsPage />} />
            <Route path="/cards/:id" element={<CardDetailsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/statement" element={<StatementUploadPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/history" element={<UploadHistoryPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </FinanceProvider>
)

export default App
