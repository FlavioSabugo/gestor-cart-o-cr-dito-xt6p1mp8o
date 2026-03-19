import { useFinance } from '@/stores/financeStore'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { VirtualCard } from '../shared/VirtualCard'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

export function CardCarousel() {
  const { cardsWithBalance } = useFinance()

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold tracking-tight">Meus Cartões</h2>
        <Link to="/cards" className="text-sm text-primary hover:underline font-medium">
          Ver todos
        </Link>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {cardsWithBalance.map((card) => (
            <CarouselItem key={card.id} className="pl-2 md:pl-4 basis-auto">
              <VirtualCard card={card} />
            </CarouselItem>
          ))}
          <CarouselItem className="pl-2 md:pl-4 basis-auto">
            <Link
              to="/cards"
              className="flex flex-col items-center justify-center w-[300px] h-[190px] rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors bg-muted/20"
            >
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-3 shadow-sm">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-medium">Adicionar Cartão</span>
            </Link>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  )
}
