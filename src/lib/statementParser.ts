import { Transaction, TransactionCategory, CategorizationRule } from '@/types/finance'

export interface ParsedTransaction {
  date: string
  description: string
  amount: number
  category: TransactionCategory
  cardholder?: string
}

export const categorizeTransaction = (
  description: string,
  rules: CategorizationRule[],
  history: Transaction[] = [],
): TransactionCategory => {
  const lowerDesc = description.toLowerCase()

  // 1. Apply custom rules
  for (const rule of rules) {
    if (lowerDesc.includes(rule.keyword.toLowerCase())) {
      return rule.category
    }
  }

  // 2. AI/History Learning: Find the most common category for this exact or similar description
  if (history && history.length > 0) {
    const pastMatches = history.filter((t) => {
      const pastDesc = t.description.toLowerCase()
      if (pastDesc === lowerDesc) return true

      const tokensA = pastDesc.split(/[\s*,-]+/).filter((x) => x.length > 2)
      const tokensB = lowerDesc.split(/[\s*,-]+/).filter((x) => x.length > 2)
      const intersection = tokensA.filter((token) => tokensB.includes(token))

      if (intersection.length > 0) return true

      return (
        (pastDesc.includes(lowerDesc) || lowerDesc.includes(pastDesc)) &&
        Math.min(pastDesc.length, lowerDesc.length) > 3
      )
    })

    if (pastMatches.length > 0) {
      const categoryCounts = pastMatches.reduce(
        (acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const mostFrequent = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]
      if (mostFrequent) return mostFrequent[0]
    }
  }

  // 3. Fallbacks
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
  if (/(iof|imposto|taxa|juros|multa|encargos)/.test(lowerDesc)) return 'Taxas e Impostos'

  return 'Outros'
}

export const parseStatementLinesFlexible = (
  lines: string[],
  rules: CategorizationRule[],
  defaultYear: string,
  defaultMonth: string,
  history: Transaction[] = [],
): ParsedTransaction[] => {
  const transactions: ParsedTransaction[] = []
  const regex =
    /^(?:(\d{2}\/\d{2})\s+)?(.*?)\s+(?:R\$?\s*)?(-?\d{1,3}(?:\.\d{3})*,\d{2}|-?\d+,\d{2}|-?\d+\.\d{2})$/i

  let lastDate = `15/${defaultMonth.padStart(2, '0')}`
  let currentCardholder = 'Principal'

  for (const line of lines) {
    const tLine = line.trim()
    if (!tLine) continue

    // Heuristic to detect cardholder block
    if (
      /^[A-ZÀ-Ÿ][A-ZÀ-Ÿ\s]{2,40}$/.test(tLine) &&
      !tLine.match(/\d/) &&
      !/(TOTAL|SALDO|PAGAMENTO|FATURA|JUROS|ENCARGOS|ANTERIOR|ATUAL|VENCIMENTO|DESCONTO|CREDITO|DEBITO|LANCAMENTO|COMPROVANTE|CARTAO|BANCO|RESUMO|VALOR|PAGO|RECEBIDO|TARIFA|MULTA|MORA|IOF|LIMITE|DISPONIVEL|TRANSACOES|NACIONAIS|INTERNACIONAIS|COMPRAS|A VISTA|PARCELADAS|ESTORNO|TAXA|OUTROS|MENSALIDADE|ANUIDADE|PROTECAO|SEGURO)/i.test(
        tLine,
      )
    ) {
      currentCardholder = tLine
      continue
    }

    const dateMatch = tLine.match(/^(\d{2}\/\d{2})$/)
    if (dateMatch) {
      lastDate = dateMatch[1]
      continue
    }

    const match = tLine.match(regex)
    if (match) {
      const dateStr = match[1] || lastDate
      let desc = match[2]
      const amountStr = match[3]

      desc = desc.replace(/^\d{2}\/\d{2}\s+/, '')
      desc = desc.replace(/\s+\d{2}\/\d{2}$/, '')
      desc = desc.trim()

      const lowerDesc = desc.toLowerCase()

      if (
        /(pagamento de fatura|pagamento recebido|saldo anterior|total da fatura|saldo atual|credito em conta|estorno)/.test(
          lowerDesc,
        )
      )
        continue
      if (/^(pagamento|fatura|total|saldo)$/.test(lowerDesc)) continue
      if (/^\d{2}\/\d{2}(\/\d{2,4})?$/.test(desc)) continue
      if (desc.length < 2) continue

      let isNegative = false
      let rawAmount = amountStr
      if (rawAmount.startsWith('-')) {
        isNegative = true
        rawAmount = rawAmount.substring(1)
      }

      let cleanAmount = rawAmount
      if (rawAmount.includes(',') && rawAmount.includes('.')) {
        if (rawAmount.lastIndexOf(',') > rawAmount.lastIndexOf('.')) {
          cleanAmount = rawAmount.replace(/\./g, '').replace(',', '.')
        } else {
          cleanAmount = rawAmount.replace(/,/g, '')
        }
      } else if (rawAmount.includes(',')) {
        cleanAmount = rawAmount.replace(',', '.')
      }

      let amount = parseFloat(cleanAmount)
      if (isNaN(amount) || amount === 0) continue

      if (isNegative) amount = -amount

      const [day, month] = dateStr.split('/')
      let txYear = parseInt(defaultYear, 10)
      const defMonthNum = parseInt(defaultMonth, 10)
      const txMonthNum = parseInt(month, 10)

      if (txMonthNum > defMonthNum && txMonthNum - defMonthNum > 6) {
        txYear--
      } else if (defMonthNum > txMonthNum && defMonthNum - txMonthNum > 6) {
        txYear++
      }

      const date = new Date(txYear, txMonthNum - 1, parseInt(day, 10))

      transactions.push({
        date: date.toISOString(),
        description: desc,
        amount,
        category: categorizeTransaction(desc, rules, history),
        cardholder: currentCardholder,
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
  history: Transaction[] = [],
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

    return parseStatementLinesFlexible(lines, rules, billingYear, billingMonth, history)
  } catch (error) {
    console.error('Error parsing PDF:', error)
    throw new Error(
      'Falha ao ler o arquivo PDF. Verifique se o arquivo é um formato de texto suportado.',
    )
  }
}
