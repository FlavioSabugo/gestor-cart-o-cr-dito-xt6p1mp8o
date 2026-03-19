import { useState } from 'react'
import { useFinance } from '@/stores/financeStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Trash2, Plus, SlidersHorizontal, Loader2 } from 'lucide-react'

export default function RulesPage() {
  const { rules, addRule, deleteRule } = useFinance()
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (keyword && category) {
      setIsSubmitting(true)
      try {
        await addRule({ keyword, category })
        setKeyword('')
        setCategory('')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteRule(id)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="w-6 h-6 text-primary" /> Regras de Categorização
        </h2>
        <p className="text-muted-foreground">
          Classifique automaticamente suas despesas ao importar arquivos PDF.
        </p>
      </div>

      <Card className="shadow-subtle lg:max-w-3xl">
        <CardHeader>
          <CardTitle>Nova Regra</CardTitle>
          <CardDescription>
            Defina qual categoria aplicar quando a descrição contiver a palavra-chave.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-2">
              <label className="text-sm font-medium">Palavra-chave</label>
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Ex: Netflix"
                required
              />
            </div>
            <div className="flex-1 w-full space-y-2">
              <label className="text-sm font-medium">Categoria Alvo</label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Assinaturas"
                required
              />
            </div>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Adicionar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-subtle">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Palavra-chave</TableHead>
                <TableHead>Categoria Alvo</TableHead>
                <TableHead className="text-right w-[100px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.keyword}</TableCell>
                  <TableCell>{rule.category}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(rule.id)}
                      disabled={deletingId === rule.id}
                    >
                      {deletingId === rule.id ? (
                        <Loader2 className="w-4 h-4 text-destructive animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-destructive" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {rules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                    Nenhuma regra criada. Suas importações usarão as categorias padrão.
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
