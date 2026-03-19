import { CardWithBalance } from '@/types/finance'
import { cn } from '@/lib/utils'
import { formatCurrency, formatCardNumber } from '@/lib/formatters'
import { Progress } from '@/components/ui/progress'
import { Wifi } from 'lucide-react'

interface VirtualCardProps {
  card: CardWithBalance
  className?: string
  onClick?: () => void
}

export function VirtualCard({ card, className, onClick }: VirtualCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex flex-col justify-between p-5 rounded-2xl text-white overflow-hidden shadow-elevation transition-transform hover:-translate-y-1 cursor-pointer w-[300px] h-[190px] shrink-0',
        card.color,
        className,
      )}
    >
      {/* Decorative background circles */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex justify-between items-start z-10">
        <div className="font-semibold text-lg tracking-wide">{card.name}</div>
        <Wifi className="w-6 h-6 rotate-90 opacity-80" />
      </div>

      <div className="z-10 mt-auto">
        <div className="text-sm opacity-80 mb-1">Fatura Atual</div>
        <div className="text-2xl font-bold tracking-tight mb-4">{formatCurrency(card.balance)}</div>

        <div className="flex justify-between items-end">
          <div>
            <div className="text-xs opacity-70 font-mono tracking-widest">
              {formatCardNumber(card.last4)}
            </div>
            <div className="text-[10px] mt-1 opacity-70">Venc. {card.dueDate}</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold italic opacity-90 capitalize">{card.brand}</div>
          </div>
        </div>
      </div>

      {/* Progress Bar overlay at the very bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
        <div
          className="h-full bg-white/70 transition-all duration-1000"
          style={{ width: `${card.usagePercentage}%` }}
        />
      </div>
    </div>
  )
}
