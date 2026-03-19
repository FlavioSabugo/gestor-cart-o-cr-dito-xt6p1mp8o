import { TransactionCategory } from '@/types/finance'

export interface ParsedTransaction {
  date: string
  description: string
  amount: number
  category: TransactionCategory
}

/**
 * Automates categorization based on description keywords
 */
export const categorizeTransaction = (description: string): TransactionCategory => {
  const lowerDesc = description.toLowerCase()

  if (/(uber|99|posto|shell|ipiranga|estacionamento|pedagio|conectar)/.test(lowerDesc))
    return 'Transporte'
  if (
    /(ifood|mcdonalds|burger king|restaurante|padaria|supermercado|extra|carrefour|pao de acucar)/.test(
      lowerDesc,
    )
  )
    return 'Alimentação'
  if (/(farmacia|drogasil|pague menos|hospital|clinica|unimed|laboratorio)/.test(lowerDesc))
    return 'Saúde'
  if (/(netflix|spotify|amazon|aws|google|apple|internet|vivo|claro|tim)/.test(lowerDesc))
    return 'Serviços'
  if (/(cinema|teatro|ingresso|show|sympla|eventim)/.test(lowerDesc)) return 'Lazer'
  if (/(faculdade|escola|curso|udemy|alura|puc|estacio)/.test(lowerDesc)) return 'Educação'
  if (/(shopping|loja|mercado livre|shopee|zara|renner|shein|aliexpress)/.test(lowerDesc))
    return 'Compras'

  return 'Outros'
}

/**
 * Mocks the PDF parsing process by returning realistic extracted data after a delay.
 * In a real application, this would involve a library like pdf.js or a backend service.
 */
export const mockParsePDF = async (file: File): Promise<ParsedTransaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate some realistic dummy data that looks like it was extracted from the uploaded PDF
      const results: ParsedTransaction[] = [
        {
          date: new Date().toISOString(),
          description: 'Uber *Trip',
          amount: 25.5,
          category: categorizeTransaction('Uber *Trip'),
        },
        {
          date: new Date(Date.now() - 86400000).toISOString(),
          description: 'iFood *McDelivery',
          amount: 65.9,
          category: categorizeTransaction('iFood *McDelivery'),
        },
        {
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          description: 'Drogasil',
          amount: 112.4,
          category: categorizeTransaction('Drogasil'),
        },
        {
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          description: 'Netflix',
          amount: 39.9,
          category: categorizeTransaction('Netflix'),
        },
        {
          date: new Date(Date.now() - 86400000 * 4).toISOString(),
          description: 'Posto Ipiranga',
          amount: 200.0,
          category: categorizeTransaction('Posto Ipiranga'),
        },
        {
          date: new Date(Date.now() - 86400000 * 5).toISOString(),
          description: 'Mercado Livre',
          amount: 345.0,
          category: categorizeTransaction('Mercado Livre'),
        },
        {
          date: new Date(Date.now() - 86400000 * 6).toISOString(),
          description: 'Smart Fit',
          amount: 120.0,
          category: categorizeTransaction('Smart Fit'),
        },
        {
          date: new Date(Date.now() - 86400000 * 7).toISOString(),
          description: 'ZARA Shopping',
          amount: 289.9,
          category: categorizeTransaction('ZARA Shopping'),
        },
        {
          date: new Date(Date.now() - 86400000 * 8).toISOString(),
          description: 'Padaria Central',
          amount: 34.5,
          category: categorizeTransaction('Padaria Central'),
        },
      ]
      resolve(results)
    }, 2000)
  })
}
