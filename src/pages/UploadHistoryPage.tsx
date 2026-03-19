import { useFinance } from '@/stores/financeStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/formatters'
import { FileText } from 'lucide-react'

export default function UploadHistoryPage() {
  const { uploads, cards } = useFinance()

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" /> Histórico de Importações
        </h2>
        <p className="text-muted-foreground">Consulte os arquivos PDF processados anteriormente.</p>
      </div>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle>Faturas Processadas</CardTitle>
          <CardDescription>
            Registro das importações automáticas realizadas na plataforma.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Arquivo</TableHead>
                <TableHead>Data do Upload</TableHead>
                <TableHead>Cartão Destino</TableHead>
                <TableHead className="text-right">Transações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploads.map((u) => {
                const card = cards.find((c) => c.id === u.cardId)
                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium text-primary">{u.filename}</TableCell>
                    <TableCell>{formatDate(u.uploadDate)}</TableCell>
                    <TableCell>
                      {card ? `${card.name} (•••• ${card.last4})` : 'Cartão Removido'}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{u.transactionCount}</TableCell>
                  </TableRow>
                )
              })}
              {uploads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                    Nenhuma fatura foi importada ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
