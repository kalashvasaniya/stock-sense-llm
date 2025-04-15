"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card } from "@/components/ui/card"
import type { VolumeDataPoint } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface VolumeChartProps {
  data: VolumeDataPoint[] | undefined
}

export default function VolumeChart({ data }: VolumeChartProps) {
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

  // Calculate average volume to determine high/low volume bars
  const avgVolume = data.reduce((sum, item) => sum + item.volume, 0) / data.length

  // Add color property to each data point
  const coloredData = formattedData.map((point) => ({
    ...point,
    color: point.volume > avgVolume ? "#8b5cf6" : "#a78bfa",
  }))

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata'
  })

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={coloredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={30}
            stroke="currentColor"
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            stroke="currentColor"
            tickFormatter={(value) => {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
              if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
              return value
            }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const volume = payload[0].value as number
                const currentTime = payload[0].payload.time
                const originalTime = data.find(
                  (d) =>
                    new Date(d.time).toLocaleTimeString('en-IN', { 
                      hour: "2-digit", 
                      minute: "2-digit",
                      timeZone: 'Asia/Kolkata'
                    }) === currentTime,
                )?.time

                let formattedVolume = volume.toString()

                if (volume >= 1000000) {
                  formattedVolume = `${(volume / 1000000).toFixed(2)}M`
                } else if (volume >= 1000) {
                  formattedVolume = `${(volume / 1000).toFixed(0)}K`
                }

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
                    <p className="text-lg font-bold text-purple-500">{formattedVolume} shares</p>
                    <p className="text-xs text-muted-foreground">
                      {volume > avgVolume ? "Above" : "Below"} average volume
                    </p>
                  </Card>
                )
              }
              return null
            }}
          />
          <Bar
            dataKey="volume"
            radius={[4, 4, 0, 0]}
            fillOpacity={0.8}
            fill="#8b5cf6"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
