"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import PriceChart from "@/components/price-chart"
import VolumeChart from "@/components/volume-chart"
import NewsFeed from "@/components/news-feed"
import AnalysisPanel from "@/components/analysis-panel"
import StockHeader from "@/components/stock-header"
import { fetchStockData } from "@/lib/actions"
import type { StockData } from "@/lib/types"
import { Search, RefreshCw, TrendingUp, BarChart3, Newspaper } from "lucide-react"

export default function StockDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState("tell me about apple stock")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadStockData = async (searchQuery: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchStockData(searchQuery)
      if (!data) {
        throw new Error("No data received from the API")
      }
      if (!data.price_data || data.price_data.length === 0) {
        throw new Error("No price data available")
      }
      if (!data.volume_data || data.volume_data.length === 0) {
        throw new Error("No volume data available")
      }
      setStockData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch stock data"
      setError(`Error: ${errorMessage}. Please try again later.`)
      console.error("Error loading stock data:", err)
      setStockData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await loadStockData(query)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadStockData(query)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadStockData(query)
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 text-center">
        <div className="max-w-md mx-auto">
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Data</CardTitle>
              <CardDescription>There was a problem loading the stock data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{error}</p>
              <div className="flex flex-col gap-2">
                <Button onClick={() => loadStockData(query)} variant="default">
                  Try Again
                </Button>
                <Button onClick={() => setError(null)} variant="outline">
                  Clear Error
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Stock Sense</h1>
        <ModeToggle />
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a stock (e.g., 'tell me about apple stock')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="default" className="bg-primary hover:bg-primary/90">
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className={isRefreshing ? "animate-spin" : ""}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </form>

      {loading ? (
        <LoadingState />
      ) : stockData ? (
        <>
          <StockHeader stockData={stockData} />

          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                <span>News</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analysis</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="overflow-hidden border-border/40 bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-foreground">Price Chart</CardTitle>
                    <CardDescription className="text-muted-foreground">15-minute intervals on {new Date().toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      timeZone: 'Asia/Kolkata'
                    })}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PriceChart data={stockData.price_data} />
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-border/40 bg-card shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-foreground">Volume Chart</CardTitle>
                    <CardDescription className="text-muted-foreground">Trading volume in 15-minute intervals on {new Date().toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      timeZone: 'Asia/Kolkata'
                    })}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <VolumeChart data={stockData.volume_data} />
                  </CardContent>
                </Card>
              </div>

              <Card className="overflow-hidden border-border/40 bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground">Latest News</CardTitle>
                  <CardDescription className="text-muted-foreground">Recent headlines about {stockData.symbol}</CardDescription>
                </CardHeader>
                <CardContent>
                  <NewsFeed news={stockData.news_data.slice(0, 5)} />
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-border/40 bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">Analysis Summary</CardTitle>
                    <Badge
                      variant={
                        stockData.agent_analysis.recommendation === "Buy"
                          ? "default"
                          : stockData.agent_analysis.recommendation === "Sell"
                            ? "destructive"
                            : "outline"
                      }
                      className="py-1 px-3"
                    >
                      {stockData.agent_analysis.recommendation}
                    </Badge>
                  </div>
                  <CardDescription className="text-muted-foreground">AI-powered market analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Sentiment</h3>
                        <p className="font-medium text-foreground">{stockData.agent_analysis.sentiment}</p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">Price Target</h3>
                        <p className="font-medium text-foreground">{stockData.agent_analysis.buy_or_sell_price.split(".")[0]}</p>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Summary</h3>
                      <p className="text-sm text-foreground">{stockData.agent_analysis.stock_data_summary}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="news">
              <Card className="overflow-hidden border-border/40 bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-foreground">All News</CardTitle>
                  <CardDescription className="text-muted-foreground">Complete news coverage for {stockData.symbol}</CardDescription>
                </CardHeader>
                <CardContent>
                  <NewsFeed news={stockData.news_data} showAll />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis">
              <AnalysisPanel analysis={stockData.agent_analysis} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-12">
          <p>No data available. Please try searching for a stock.</p>
        </div>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-6 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
