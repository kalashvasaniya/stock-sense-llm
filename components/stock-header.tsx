import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp } from "lucide-react"
import type { StockData } from "@/lib/types"

interface StockHeaderProps {
  stockData: StockData | null
}

export default function StockHeader({ stockData }: StockHeaderProps) {
  if (!stockData || !stockData.price_data || stockData.price_data.length === 0) {
    return (
      <Card className="mb-6 overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Loading...</h2>
              <p className="text-muted-foreground">Please wait while we fetch the data</p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  const lastPrice = stockData.price_data[stockData.price_data.length - 1].close
  const firstPrice = stockData.price_data[0].close
  const priceDifference = lastPrice - firstPrice
  const percentChange = (priceDifference / firstPrice) * 100

  const isPositive = priceDifference >= 0
  const changeColor = isPositive ? "text-emerald-500" : "text-red-500"
  const ChangeIcon = isPositive ? ArrowUp : ArrowDown
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  // Get company name based on symbol
  const getCompanyName = (symbol: string) => {
    // The company name will come from the API response
    // If not available, return the symbol
    return stockData.agent_analysis?.company_name || symbol
  }

  return (
    <Card className="mb-6 overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{stockData.symbol}</h1>
              <Badge
                variant={
                  stockData.agent_analysis.sentiment.includes("Bullish")
                    ? "default"
                    : stockData.agent_analysis.sentiment.includes("Bearish")
                      ? "destructive"
                      : "outline"
                }
                className="text-xs py-0"
              >
                {stockData.agent_analysis.sentiment}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">{getCompanyName(stockData.symbol)}</p>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <p className="text-3xl font-bold">${lastPrice.toFixed(2)}</p>
              <div className={`flex items-center gap-1 ${changeColor}`}>
                <ChangeIcon className="h-4 w-4" />
                <span className="font-medium">
                  {priceDifference.toFixed(2)} ({percentChange.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div
              className={`hidden md:flex h-14 w-14 items-center justify-center rounded-full ${isPositive ? "bg-emerald-500/10" : "bg-red-500/10"}`}
            >
              <TrendIcon className={`h-8 w-8 ${changeColor}`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Volume (Today)</p>
            <p className="font-medium">
              {(stockData.volume_data.reduce((sum, item) => sum + item.volume, 0) / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Day Range</p>
            <p className="font-medium">
              ${Math.min(...stockData.price_data.map((d) => d.close)).toFixed(2)} - $
              {Math.max(...stockData.price_data.map((d) => d.close)).toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Recommendation</p>
            <p className="font-medium">{stockData.agent_analysis.recommendation}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">News Count</p>
            <p className="font-medium">{stockData.news_data.length}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
