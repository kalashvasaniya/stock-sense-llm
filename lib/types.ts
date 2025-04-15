export interface PriceDataPoint {
  time: string
  close: number
}

export interface VolumeDataPoint {
  time: string
  volume: number
}

export interface NewsItem {
  headline: string
  summary: string
}

export interface Analysis {
  symbol: string
  company_name: string
  sentiment: string
  recommendation: string
  reasoning: string
  buy_or_sell_price: string
  news_summary: string
  stock_data_summary: string
}

export interface StockData {
  symbol: string
  price_data: PriceDataPoint[]
  volume_data: VolumeDataPoint[]
  news_data: NewsItem[]
  agent_analysis: Analysis
}

export interface ApiResponse {
  query: string
  symbol: string
  graph_data: string
  news_data: NewsItem[]
  agent_analysis: Analysis
}
