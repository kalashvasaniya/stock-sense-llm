"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"
import type { PriceDataPoint } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface PriceChartProps {
  data: PriceDataPoint[] | undefined
}

export default function PriceChart({ data }: PriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[300px]">
        <Skeleton className="h-full w-full" />
      </div>
    )
  }

  const formattedData = data.map((point) => ({
    ...point,
    time: new Date(point.time).toLocaleTimeString('en-IN', { 
      hour: "2-digit", 
      minute: "2-digit",
      timeZone: 'Asia/Kolkata'
    }),
  }))

  const minPrice = Math.floor(Math.min(...data.map((d) => d.close)) * 0.998)
  const maxPrice = Math.ceil(Math.max(...data.map((d) => d.close)) * 1.002)

  // Determine if the overall trend is positive
  const isPositive = data[data.length - 1].close >= data[0].close

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  })

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.8} />
              <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value}
            minTickGap={30}
            stroke="currentColor"
          />
          <YAxis
            domain={[minPrice, maxPrice]}
            tickCount={5}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${value}`}
            stroke="currentColor"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const currentValue = payload[0].value as number
                const currentTime = payload[0].payload.time
                const originalTime = data.find(
                  (d) =>
                    new Date(d.time).toLocaleTimeString('en-IN', { 
                      hour: "2-digit", 
                      minute: "2-digit",
                      timeZone: 'Asia/Kolkata'
                    }) === currentTime,
                )?.time

                return (
                  <Card className="p-3 shadow-lg border bg-card/95 backdrop-blur-sm">
                    <p className="font-medium text-sm">
                      {new Date(originalTime || "").toLocaleString('en-IN', {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: 'Asia/Kolkata'
                      })}
                    </p>
                    <p className={`text-lg font-bold ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                      ${currentValue.toFixed(2)}
                    </p>
                  </Card>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="close"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorClose)"
            activeDot={{ r: 6, strokeWidth: 0, fill: isPositive ? "#10b981" : "#ef4444" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
