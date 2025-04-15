"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, BarChart3, LineChart, Lightbulb, BarChart2, Newspaper } from "lucide-react"
import type { Analysis } from "@/lib/types"

interface AnalysisPanelProps {
  analysis: Analysis
}

export default function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  const getSentimentIcon = () => {
    if (analysis.sentiment.includes("Bullish")) return <TrendingUp className="h-5 w-5 text-emerald-500" />
    if (analysis.sentiment.includes("Bearish")) return <TrendingDown className="h-5 w-5 text-red-500" />
    return <LineChart className="h-5 w-5 text-amber-500" />
  }

  const getRecommendationColor = () => {
    if (analysis.recommendation === "Buy") return "default"
    if (analysis.recommendation === "Sell") return "destructive"
    return "outline"
  }

  const getSentimentColor = () => {
    if (analysis.sentiment.includes("Bullish")) return "text-emerald-500"
    if (analysis.sentiment.includes("Bearish")) return "text-red-500"
    return "text-amber-500"
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-border/40 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Analysis for {analysis.symbol}</span>
            <Badge variant={getRecommendationColor()} className="text-lg py-1 px-3">
              {analysis.recommendation}
            </Badge>
          </CardTitle>
          <CardDescription>AI-powered market analysis and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/40 bg-card/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  {getSentimentIcon()}
                  <h3 className="font-medium">Market Sentiment</h3>
                </div>
                <p className={getSentimentColor()}>{analysis.sentiment}</p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Price Target</h3>
                </div>
                <p className="text-purple-500">{analysis.buy_or_sell_price}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/40 bg-card/30">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium">Reasoning</h3>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{analysis.reasoning}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/40 bg-card/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">News Summary</h3>
                </div>
                <p className="text-sm text-muted-foreground">{analysis.news_summary}</p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/30">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-cyan-500" />
                  <h3 className="font-medium">Stock Data Summary</h3>
                </div>
                <p className="text-sm text-muted-foreground">{analysis.stock_data_summary}</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
