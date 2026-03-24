import { TransactionCategory, CategorizationRule } from '@/types/finance'

export interface ParsedTransaction {
  date: string
  description: string
  amount: number
  category: TransactionCategory
}

export const categorizeTransaction = (
  description: string,
  rules: CategorizationRule[],
): TransactionCategory => {
  const lowerDesc = description.toLowerCase()

  // Apply custom rules
  for (const rule of rules) {
    if (lowerDesc.includes(rule.keyword.toLowerCase())) {
      return rule.category
    }
  }

  // Fallbacks
  if (/(posto|shell|ipiranga|petrobras|br distribuidora|ale)/.test(lowerDesc)) return 'Combustível'
  if (
    /(99app|99|uber|estacionamento|pedagio|conectar|sem parar|veloe|metrô|metro|cptm)/.test(
      lowerDesc,
    )
  )
    return 'Transporte'
  if (
    /(ifood|mcdonalds|burger king|restaurante|padaria|supermercado|extra|carrefour|pao de acucar)/.test(
      lowerDesc,
    )
  )
    return 'Alimentação'
  if (/(hospital|clinica|unimed|laboratorio|farmacia|drogasil|pague menos)/.test(lowerDesc))
    return 'Saúde'
  if (/(cinema|teatro|ingresso|show|sympla|eventim)/.test(lowerDesc)) return 'Lazer'
  if (/(faculdade|escola|curso|udemy|alura|puc|estacio)/.test(lowerDesc)) return 'Educação'
  if (/(shopping|loja|mercado livre|shopee|zara|renner|shein|aliexpress|amazon)/.test(lowerDesc))
    return 'Compras'
  if (/(netflix|spotify|prime|hbo|disney|apple)/.test(lowerDesc)) return 'Assinaturas'

  return 'Outros'
}

export const parseStatementLinesFlexible = (
  lines: string[],
  rules: CategorizationRule[],
  defaultYear: string,
  defaultMonth: string,
): ParsedTransaction[] => {
  const transactions: ParsedTransaction[] = []
  // Regex to match typical lines: "15/04 UBER *TRIP R$ 25,50" or "UBER 25.50"
  const regex =
    /^(?:(\d{2}\/\d{2})\s+)?(.+?)\s+(?:R\$?\s*)?(-?\d{1,3}(?:\.\d{3})*,\d{2}|-?\d+,\d{2}|-?\d+\.\d{2})$/i

  let lastDate = `15/${defaultMonth.padStart(2, '0')}`

  for (const line of lines) {
    const dateMatch = line.match(/^(\d{2}\/\d{2})$/)
    if (dateMatch) {
      lastDate = dateMatch[1]
      continue
    }

    const match = line.match(regex)
    if (match) {
      const dateStr = match[1] || lastDate
      const desc = match[2]
      const amountStr = match[3]

      // Ignore common non-expense lines
      if (/(pagamento|fatura|recebido|pago|saldo anterior|iof|juros|multa|encargos)/i.test(desc))
        continue

      let cleanAmount = amountStr.replace(/\./g, '').replace(',', '.')
      if (amountStr.includes('.') && !amountStr.includes(',')) {
        cleanAmount = amountStr
      }
      const amount = parseFloat(cleanAmount)
      if (isNaN(amount) || amount <= 0) continue

      const [day, month] = dateStr.split('/')
      let txYear = parseInt(defaultYear, 10)
      const defMonthNum = parseInt(defaultMonth, 10)
      const txMonthNum = parseInt(month, 10)

      // Handle year wrap-around robustly
      // If transaction month is much greater than billing month (e.g. tx=11, bill=01), it's from the previous year
      if (txMonthNum > defMonthNum && txMonthNum - defMonthNum > 6) {
        txYear--
      } else if (defMonthNum > txMonthNum && defMonthNum - txMonthNum > 6) {
        // e.g. tx=01, bill=12 -> tx is early next year
        txYear++
      }

      const date = new Date(txYear, txMonthNum - 1, parseInt(day, 10))

      transactions.push({
        date: date.toISOString(),
        description: desc.trim(),
        amount,
        category: categorizeTransaction(desc.trim(), rules),
      })
    }
  }
  return transactions
}

export const parsePDF = async (
  file: File,
  rules: CategorizationRule[],
  billingMonth: string,
  billingYear: string,
): Promise<ParsedTransaction[]> => {
  try {
    if (!(window as any).pdfjsLib) {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
      await new Promise((resolve, reject) => {
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
      const pdfjsLib = (window as any).pdfjsLib
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
    }

    const pdfjsLib = (window as any).pdfjsLib
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    const lines: string[] = []

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()

      const yMap = new Map<number, string[]>()
      for (const item of textContent.items) {
        if (!item.str.trim()) continue
        const y = Math.round(item.transform[5] / 2) * 2
        if (!yMap.has(y)) yMap.set(y, [])
        yMap.get(y)!.push(item.str.trim())
      }

      const sortedYs = Array.from(yMap.keys()).sort((a, b) => b - a)
      for (const y of sortedYs) {
        lines.push(yMap.get(y)!.join(' '))
      }
    }

    return parseStatementLinesFlexible(lines, rules, billingYear, billingMonth)
  } catch (error) {
    console.error('Error parsing PDF:', error)
    throw new Error(
      'Falha ao ler o arquivo PDF. Verifique se o arquivo é um formato de texto suportado.',
    )
  }
}
