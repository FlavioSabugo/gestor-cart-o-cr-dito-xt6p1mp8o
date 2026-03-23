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

  // Fallbacks
  if (/(posto|shell|ipiranga|petrobras|br distribuidora|ale)/.test(lowerDesc)) return 'Combustível'
  if (/(99|uber|estacionamento|pedagio|conectar|sem parar|veloe)/.test(lowerDesc))
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
): Promise<ParsedTransaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate real data from user's PDF and apply custom rules to the mock data
      const results: ParsedTransaction[] = [
        {
          date: new Date().toISOString(),
          description: 'Uber *Trip',
          amount: 25.5,
          category: categorizeTransaction('Uber *Trip', rules),
        },
        {
          date: new Date(Date.now() - 86400000).toISOString(),
          description: 'iFood *McDelivery',
          amount: 65.9,
          category: categorizeTransaction('iFood *McDelivery', rules),
        },
        {
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          description: 'Drogasil',
          amount: 112.4,
          category: categorizeTransaction('Drogasil', rules),
        },
        {
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          description: 'Netflix',
          amount: 39.9,
          category: categorizeTransaction('Netflix', rules),
        },
        {
          date: new Date(Date.now() - 86400000 * 4).toISOString(),
          description: 'Posto Ipiranga',
          amount: 200.0,
          category: categorizeTransaction('Posto Ipiranga', rules),
        },
        {
          date: new Date(Date.now() - 86400000 * 5).toISOString(),
          description: 'Mercado Livre',
          amount: 345.0,
          category: categorizeTransaction('Mercado Livre', rules),
        },
        {
          date: new Date(Date.now() - 86400000 * 6).toISOString(),
          description: 'Smart Fit',
          amount: 120.0,
          category: categorizeTransaction('Smart Fit', rules),
        },
        {
          date: new Date(Date.now() - 86400000 * 7).toISOString(),
          description: 'ZARA Shopping',
          amount: 289.9,
          category: categorizeTransaction('ZARA Shopping', rules),
        },
        {
          date: new Date(Date.now() - 86400000 * 8).toISOString(),
          description: 'Padaria Central',
          amount: 34.5,
          category: categorizeTransaction('Padaria Central', rules),
        },
      ]
      resolve(results)
    }, 2000)
  })
}
