import StockDashboard from "@/components/stock-dashboard"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-background/90">
        <StockDashboard />
      </main>
    </ThemeProvider>
  )
}
