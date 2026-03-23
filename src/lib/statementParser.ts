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

  // First apply custom user rules from database mappings
  for (const rule of rules) {
    if (lowerDesc.includes(rule.keyword.toLowerCase())) {
      return rule.category
    }
  }

  // Fallbacks - Specially updated for better Transport and Fuel coverage
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
  if (/(hospital|clinica|unimed|laboratorio)/.test(lowerDesc)) return 'Saúde'
  if (/(cinema|teatro|ingresso|show|sympla|eventim)/.test(lowerDesc)) return 'Lazer'
  if (/(faculdade|escola|curso|udemy|alura|puc|estacio)/.test(lowerDesc)) return 'Educação'
  if (/(shopping|loja|mercado livre|shopee|zara|renner|shein|aliexpress)/.test(lowerDesc))
    return 'Compras'

  return 'Outros'
}

export const mockParsePDF = async (
  file: File,
  rules: CategorizationRule[],
  billingMonth?: string,
  billingYear?: string,
): Promise<ParsedTransaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate real data from user's PDF and apply custom rules to the mock data
      // Ensuring accurate date assignment based on selected invoice period
      const baseYear = billingYear ? parseInt(billingYear, 10) : new Date().getFullYear()
      const baseMonth = billingMonth ? parseInt(billingMonth, 10) - 1 : new Date().getMonth()

      const createDate = (dayOffset: number) => {
        const date = new Date(baseYear, baseMonth, 15 - dayOffset)
        return date.toISOString()
      }

      const results: ParsedTransaction[] = [
        {
          date: createDate(0),
          description: 'Uber *Trip',
          amount: 25.5,
          category: categorizeTransaction('Uber *Trip', rules),
        },
        {
          date: createDate(1),
          description: 'iFood *McDelivery',
          amount: 65.9,
          category: categorizeTransaction('iFood *McDelivery', rules),
        },
        {
          date: createDate(2),
          description: 'Drogasil',
          amount: 112.4,
          category: categorizeTransaction('Drogasil', rules),
        },
        {
          date: createDate(3),
          description: 'Netflix',
          amount: 39.9,
          category: categorizeTransaction('Netflix', rules),
        },
        {
          date: createDate(4),
          description: 'Posto Ipiranga',
          amount: 200.0,
          category: categorizeTransaction('Posto Ipiranga', rules),
        },
        {
          date: createDate(5),
          description: 'Mercado Livre',
          amount: 345.0,
          category: categorizeTransaction('Mercado Livre', rules),
        },
        {
          date: createDate(6),
          description: 'Smart Fit',
          amount: 120.0,
          category: categorizeTransaction('Smart Fit', rules),
        },
        {
          date: createDate(7),
          description: 'ZARA Shopping',
          amount: 289.9,
          category: categorizeTransaction('ZARA Shopping', rules),
        },
        {
          date: createDate(8),
          description: 'Padaria Central',
          amount: 34.5,
          category: categorizeTransaction('Padaria Central', rules),
        },
      ]
      resolve(results)
    }, 2000)
  })
}
