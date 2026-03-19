import { useState, useRef } from 'react'
import { UploadCloud, FileType } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function UploadDropzone({ onFileSelect, disabled }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return

    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onFileSelect(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }

  return (
    <div
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer min-h-[300px]',
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      )}
    >
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        {isDragging ? (
          <FileType className="w-10 h-10 text-primary animate-pulse" />
        ) : (
          <UploadCloud className="w-10 h-10 text-primary" />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {isDragging ? 'Solte para enviar' : 'Faça upload da sua Fatura'}
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        Arraste e solte o arquivo PDF da sua fatura aqui ou clique para selecionar. O sistema irá
        extrair e categorizar automaticamente.
      </p>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span className="bg-muted px-2 py-1 rounded">Apenas PDF</span>
        <span>Até 10MB</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
    </div>
  )
}
