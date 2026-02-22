"use client";

import { useGetRevenueOverTimeQuery } from "@/lib/features/apiSlice";
import { Loader2, BarChart3 } from "lucide-react";
import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// 📅 Utility to force chronological sorting (fixes Java HashMap scrambling)
const monthOrder: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

export default function RevenueChart() {
  const { data: chartData = [], isLoading } = useGetRevenueOverTimeQuery();
  const { resolvedTheme } = useTheme();

  // Sort data chronologically before feeding it to the chart
  const sortedData = [...chartData].sort(
    (a, b) => monthOrder[a.month] - monthOrder[b.month],
  );

  // Custom glassmorphism tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
            {label} 2026
          </p>
          <p className="text-2xl font-black text-blue-500 tracking-tighter">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md w-full h-full flex flex-col transition-colors duration-500">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl font-black tracking-tight">
          Revenue Trends
        </CardTitle>
        <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
          Monthly Paid Contracts
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-[350px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500/50" />
          </div>
        ) : sortedData.length === 0 ? (
          <div className="flex flex-col h-full items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="h-20 w-20 bg-muted/30 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <BarChart3 className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-black tracking-tight">
              No Revenue Data
            </h3>
            <p className="text-xs font-medium text-muted-foreground mt-2 max-w-[200px] leading-relaxed">
              Your financial trends will appear here once contracts are marked
              as PAID.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              key={resolvedTheme}
              data={sortedData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              {/* 🎨 THE MAGIC FIX: Define a stunning SVG Gradient */}
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={1} />{" "}
                  {/* Vibrant Blue */}
                  <stop
                    offset="95%"
                    stopColor="#3b82f6"
                    stopOpacity={0.1}
                  />{" "}
                  {/* Fades to transparent */}
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={resolvedTheme === "dark" ? "#334155" : "#e2e8f0"} // Safe hex colors for grid
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 800,
                  fill: "#94a3b8", // Safe slate-400 hex
                }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fontWeight: 800,
                  fill: "#94a3b8", // Safe slate-400 hex
                }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                cursor={{
                  fill: resolvedTheme === "dark" ? "#1e293b" : "#f1f5f9",
                }}
                content={<CustomTooltip />}
              />
              <Bar
                dataKey="revenue"
                fill="url(#colorRevenue)" // 👈 Apply the gradient here
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
