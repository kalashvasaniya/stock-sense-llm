"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Newspaper, ChevronDown, ChevronUp } from "lucide-react"
import type { NewsItem } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface NewsFeedProps {
  news: NewsItem[]
  showAll?: boolean
}

export default function NewsFeed({ news, showAll = false }: NewsFeedProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Function to determine sentiment of a news item
  const getNewsSentiment = (headline: string, summary: string): "positive" | "negative" | "neutral" => {
    const text = (headline + " " + summary).toLowerCase()

    const positiveTerms = [
      "up",
      "rise",
      "gain",
      "growth",
      "positive",
      "bullish",
      "boost",
      "increase",
      "higher",
      "rally",
      "surge",
      "soar",
      "jump",
      "climb",
    ]
    const negativeTerms = [
      "down",
      "fall",
      "drop",
      "decline",
      "negative",
      "bearish",
      "decrease",
      "lower",
      "plunge",
      "sink",
      "tumble",
      "slide",
      "slip",
      "concern",
      "risk",
      "warn",
      "crisis",
    ]

    let positiveCount = 0
    let negativeCount = 0

    positiveTerms.forEach((term) => {
      if (text.includes(term)) positiveCount++
    })

    negativeTerms.forEach((term) => {
      if (text.includes(term)) negativeCount++
    })

    if (positiveCount > negativeCount) return "positive"
    if (negativeCount > positiveCount) return "negative"
    return "neutral"
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {news.map((item, index) => {
        const sentiment = getNewsSentiment(item.headline, item.summary || "")

        return (
          <Card
            key={index}
            className={cn(
              "overflow-hidden border-border/40 bg-card shadow-sm transition-all duration-200 hover:shadow-md",
              sentiment === "positive" && "border-l-4 border-l-emerald-500",
              sentiment === "negative" && "border-l-4 border-l-red-500",
              sentiment === "neutral" && "border-l-4 border-l-amber-500",
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-1 p-2 rounded-md",
                    sentiment === "positive" && "bg-emerald-500/10",
                    sentiment === "negative" && "bg-red-500/10",
                    sentiment === "neutral" && "bg-amber-500/10",
                  )}
                >
                  <Newspaper
                    className={cn(
                      "h-5 w-5",
                      sentiment === "positive" && "text-emerald-600",
                      sentiment === "negative" && "text-red-600",
                      sentiment === "neutral" && "text-amber-600",
                    )}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-base text-foreground">{item.headline}</h3>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs whitespace-nowrap",
                        sentiment === "positive" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                        sentiment === "negative" && "bg-red-500/10 text-red-600 border-red-500/20",
                        sentiment === "neutral" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                      )}
                    >
                      {sentiment === "positive" ? "Bullish" : sentiment === "negative" ? "Bearish" : "Neutral"}
                    </Badge>
                  </div>

                  {expandedItems[index] || showAll ? (
                    <p className="text-sm text-muted-foreground mt-1">{item.summary}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.summary}</p>
                  )}
                  {item.summary && item.summary.length > 100 && !showAll && (
                    <button
                      onClick={() => toggleItem(index)}
                      className={cn(
                        "text-xs mt-1 flex items-center font-medium",
                        sentiment === "positive" && "text-emerald-600 hover:text-emerald-700",
                        sentiment === "negative" && "text-red-600 hover:text-red-700",
                        sentiment === "neutral" && "text-amber-600 hover:text-amber-700",
                      )}
                    >
                      {expandedItems[index] ? (
                        <>
                          <span>Show less</span>
                          <ChevronUp className="h-3 w-3 ml-1" />
                        </>
                      ) : (
                        <>
                          <span>Read more</span>
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
