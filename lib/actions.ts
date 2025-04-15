"use server"

import type { StockData, ApiResponse } from "./types"

export async function fetchStockData(query: string): Promise<StockData> {
  try {
    console.log("Fetching stock data for query:", query)
    const response = await fetch("https://stock-sense-llm.onrender.com/run-graph", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
      mode: "cors",
      credentials: "omit",
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

    let data: ApiResponse
    try {
      data = await response.json()
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      throw new Error("Failed to parse server response")
    }

    console.log("API Response:", data)

    if (!data || !data.graph_data) {
      throw new Error("Invalid response format from server")
    }

    // Parse the graph_data string into an object
    let graphData
    try {
      graphData = JSON.parse(data.graph_data)
    } catch (parseError) {
      console.error("Error parsing graph data:", parseError)
      throw new Error("Failed to parse graph data")
    }

    console.log("Parsed graph data:", graphData)

    if (!graphData.price_data || !graphData.volume_data) {
      throw new Error("Missing required data in graph_data")
    }

    return {
      symbol: data.symbol,
      price_data: graphData.price_data,
      volume_data: graphData.volume_data,
      news_data: data.news_data || [],
      agent_analysis: data.agent_analysis,
    }
  } catch (error) {
    console.error("Error fetching stock data:", error)
    throw new Error(`Failed to fetch stock data: ${error instanceof Error ? error.message : String(error)}`)
  }
}
