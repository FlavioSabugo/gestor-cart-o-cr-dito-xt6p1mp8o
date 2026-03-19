import { useState } from 'react'
import { useFinance } from '@/stores/financeStore'
import { FileUp, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UploadDropzone } from '@/components/statement/UploadDropzone'
import { StatementResults } from '@/components/statement/StatementResults'
import { mockParsePDF, ParsedTransaction } from '@/lib/statementParser'
import { useNavigate } from 'react-router-dom'

export default function StatementUploadPage() {
  const navigate = useNavigate()
  const { rules } = useFinance()
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<ParsedTransaction[] | null>(null)

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile)
    setIsProcessing(true)

    try {
      // Simulate PDF parsing and extraction using active custom rules
      const extractedData = await mockParsePDF(selectedFile, rules)
      setResults(extractedData)
    } catch (error) {
      console.error('Failed to parse PDF', error)
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

  return (
    <div className="space-y-8 pb-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileUp className="w-6 h-6 text-primary" /> Importar Fatura PDF
          </h2>
          <p className="text-muted-foreground">
            Extração automática aplicando suas regras de categorização.
          </p>
        </div>
        {results && (
          <Button variant="outline" onClick={handleReset}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Outro Arquivo
          </Button>
        )}
      </div>

      {!file && !isProcessing && !results && (
        <div className="max-w-3xl mx-auto pt-8">
          <UploadDropzone onFileSelect={handleFileSelect} />
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
              Lendo transações, identificando valores e aplicando suas regras personalizadas no
              arquivo {file?.name}.
            </p>
          </div>
        </div>
      )}

      {results && file && !isProcessing && (
        <StatementResults results={results} file={file} onImportComplete={handleImportComplete} />
      )}
    </div>
  )
}
