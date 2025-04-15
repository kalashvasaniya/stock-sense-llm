"use server"

import type { StockData, ApiResponse } from "./types"

export async function fetchStockData(query: string): Promise<StockData> {
  try {
    console.log("Fetching stock data for query:", query)
    const response = await fetch("https://stock-sense-llm.onrender.com/run-graph", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      throw new Error(`API request failed with status ${response.status}: ${errorText}`)
    }

    const data: ApiResponse = await response.json()
    console.log("API Response:", data)

    // Parse the graph_data string into an object
    const graphData = JSON.parse(data.graph_data)
    console.log("Parsed graph data:", graphData)

    return {
      symbol: data.symbol,
      price_data: graphData.price_data,
      volume_data: graphData.volume_data,
      news_data: data.news_data,
      agent_analysis: data.agent_analysis,
    }
  } catch (error) {
    console.error("Error fetching stock data:", error)
    throw new Error(`Failed to fetch stock data: ${error instanceof Error ? error.message : String(error)}`)
  }
}
