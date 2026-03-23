import { useFinance } from '@/stores/financeStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MONTHS } from '@/lib/constants'

export function PeriodSelector() {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = useFinance()

  const currentYear = new Date().getFullYear()
  const YEARS = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString())

  return (
    <div className="flex items-center bg-background/50 border rounded-lg shadow-sm p-0.5">
      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
        <SelectTrigger className="w-[120px] h-9 border-none bg-transparent shadow-none focus:ring-0">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="w-[1px] h-4 bg-border mx-1" />
      <Select value={selectedYear} onValueChange={setSelectedYear}>
        <SelectTrigger className="w-[80px] h-9 border-none bg-transparent shadow-none focus:ring-0">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
