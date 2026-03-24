import { useState } from 'react'
import { useFinance } from '@/stores/financeStore'
import { FileUp, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UploadDropzone } from '@/components/statement/UploadDropzone'
import { StatementResults } from '@/components/statement/StatementResults'
import { parsePDF, categorizeTransaction, ParsedTransaction } from '@/lib/statementParser'
import { useNavigate } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { MONTHS } from '@/lib/constants'
import { toast } from '@/hooks/use-toast'

export default function StatementUploadPage() {
  const navigate = useNavigate()
  const { rules, cards } = useFinance()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<ParsedTransaction[] | null>(null)

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')
  const currentYear = new Date().getFullYear()
  const currentYearStr = String(currentYear)
  const YEARS = Array.from({ length: 5 }, (_, i) => (currentYear - 2 + i).toString())

  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [selectedYear, setSelectedYear] = useState<string>(currentYearStr)

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setIsProcessing(true)

    try {
      if (selectedFile.name.toLowerCase().endsWith('.csv')) {
        const text = await selectedFile.text()
        const lines = text.split('\n')
        const parsedTxs: ParsedTransaction[] = []
        for (const line of lines) {
          if (!line.trim()) continue
          const parts = line.split(',')
          if (parts.length >= 3) {
            const dateStr = parts[0].trim()
            const desc = parts[1].trim()
            const amountStr = parts[2].trim()
            const amount = parseFloat(amountStr)

            if (!isNaN(amount) && dateStr && desc) {
              let parsedDate = new Date(dateStr)
              if (isNaN(parsedDate.getTime())) {
                parsedDate = new Date(
                  parseInt(selectedYear, 10),
                  parseInt(selectedMonth, 10) - 1,
                  15,
                )
              }
              parsedTxs.push({
                date: parsedDate.toISOString(),
                description: desc,
                amount,
                category: categorizeTransaction(desc, rules),
              })
            }
          }
        }
        setResults(parsedTxs)
      } else {
        const extractedData = await parsePDF(selectedFile, rules, selectedMonth, selectedYear)
        if (extractedData.length === 0) {
          toast({
            title: 'Nenhuma transação encontrada',
            description:
              'Não foi possível extrair dados automáticos deste PDF. O formato pode não ser suportado.',
            variant: 'destructive',
          })
          setFile(null)
        } else {
          setResults(extractedData)
        }
      }
    } catch (error) {
      console.error('Failed to parse file', error)
      toast({
        title: 'Erro na leitura',
        description: error instanceof Error ? error.message : 'Falha ao processar o arquivo.',
        variant: 'destructive',
      })
      setFile(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResults(null)
  }

  const handleImportComplete = () => {
    navigate('/transactions')
  }

  const isFormValid = selectedCard !== '' && selectedMonth !== '' && selectedYear !== ''

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileUp className="w-6 h-6 text-primary" /> Importar Fatura (PDF / CSV)
          </h2>
          <p className="text-muted-foreground">
            Envie sua fatura em PDF ou CSV para extração automática e categorização inteligente.
          </p>
        </div>
        {results && (
          <Button variant="outline" onClick={handleReset}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Outro Arquivo
          </Button>
        )}
      </div>

      {!file && !isProcessing && !results && (
        <div className="max-w-4xl mx-auto space-y-8 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border rounded-xl bg-card text-card-foreground shadow-subtle">
            <div className="space-y-2">
              <Label>Cartão de Crédito</Label>
              <Select value={selectedCard} onValueChange={setSelectedCard}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cartão" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} (•••• {c.last4})
                    </SelectItem>
                  ))}
                  {cards.length === 0 && (
                    <SelectItem value="none" disabled>
                      Nenhum cartão cadastrado
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mês da Fatura</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <Label>Ano da Fatura</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
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
          </div>

          <div className="space-y-4">
            <UploadDropzone onFileSelect={handleFileSelect} disabled={!isFormValid} />
            {!isFormValid && (
              <p className="text-sm flex items-center justify-center text-muted-foreground bg-muted/50 p-3 rounded-lg border border-dashed">
                <AlertCircle className="w-4 h-4 mr-2 text-primary" />
                Selecione o cartão, mês e ano para habilitar o envio do arquivo.
              </p>
            )}
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">Analisando o documento...</h3>
            <p className="text-muted-foreground max-w-sm">
              Lendo transações e processando os dados extraídos do arquivo {file?.name}...
            </p>
          </div>
        </div>
      )}

      {results && file && !isProcessing && (
        <StatementResults
          results={results}
          file={file}
          cardId={selectedCard}
          billingMonth={selectedMonth}
          billingYear={selectedYear}
          onImportComplete={handleImportComplete}
        />
      )}
    </div>
  )
}
