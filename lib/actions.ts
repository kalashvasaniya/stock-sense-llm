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
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      })
      throw new Error(`API request failed with status ${response.status}: ${errorText}`)
    }

    let data: ApiResponse
    try {
      const responseText = await response.text()
      console.log("Raw API Response:", responseText)
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      throw new Error(`Failed to parse server response: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
    }

    console.log("API Response:", data)

    if (!data || !data.graph_data) {
      console.error("Invalid response format:", data)
      throw new Error("Invalid response format from server: missing graph_data")
    }

    // Parse the graph_data string into an object
    let graphData
    try {
      // Clean the graph_data string to ensure it's valid JSON
      const cleanedGraphData = data.graph_data.replace(/\n/g, "").replace(/\s+/g, " ")
      console.log("Cleaned graph_data:", cleanedGraphData)
      graphData = JSON.parse(cleanedGraphData)
    } catch (parseError) {
      console.error("Error parsing graph data:", parseError, "Raw graph_data:", data.graph_data)
      throw new Error(`Failed to parse graph data: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
    }

    console.log("Parsed graph data:", graphData)

    if (!graphData.price_data || !graphData.volume_data) {
      console.error("Missing required data in graph_data:", graphData)
      throw new Error("Missing required data in graph_data: price_data or volume_data is missing")
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
