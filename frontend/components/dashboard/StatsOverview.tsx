"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  Briefcase,
  Users,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import PaidUnpaidPieChart from "@/components/PaidUnpaidPieChart";
import RevenueChart from "./RevenueChart"; // 👈 Import your new Bar Chart
import { cn } from "@/lib/utils";

interface StatsProps {
  stats: any;
}

export default function StatsOverview({ stats }: StatsProps) {
  // Staggered entrance animation for a smooth, high-end feel
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* --- TOP ROW: PRIMARY METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={stats?.totalPaidAmount}
          description="Collected from paid invoices"
          icon={<DollarSign className="h-4 w-4" />}
          trend="+12% from last month"
          color="emerald"
          variant={item}
        />
        <StatCard
          title="Pending"
          value={stats?.totalPendingAmount}
          description="Draft or active contracts"
          icon={<Briefcase className="h-4 w-4" />}
          color="amber"
          variant={item}
        />
        <StatCard
          title="Active Clients"
          value={stats?.totalClients}
          description="Total client base"
          icon={<Users className="h-4 w-4" />}
          isRawNumber
          color="blue"
          variant={item}
        />
        <StatCard
          title="Total Overdue"
          value={stats?.totalOverdueAmount}
          description="Unpaid past due date"
          icon={<AlertCircle className="h-4 w-4" />}
          color="rose"
          variant={item}
        />
      </div>

      {/* --- BOTTOM ROW: VISUAL ANALYTICS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: REVENUE BAR CHART (Takes 2 columns) */}
        <motion.div variants={item} className="lg:col-span-2 h-full">
          <RevenueChart />
        </motion.div>

        {/* RIGHT: FINANCIAL HEALTH & PIE CHART (Takes 1 column) */}
        <motion.div variants={item} className="lg:col-span-1 h-full">
          <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden h-full flex flex-col">
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-amber-500" />

            <CardHeader className="pb-0">
              <CardTitle className="text-lg font-black tracking-tight">
                Financial Health
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                Paid vs. Outstanding
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between p-6">
              {/* Pie Chart Container */}
              <div className="w-full flex justify-center items-center flex-1 min-h-[200px]">
                <div className="w-full max-w-[220px] aspect-square">
                  <PaidUnpaidPieChart
                    paid={stats?.totalPaidAmount ?? 0}
                    unpaid={
                      (stats?.totalPendingAmount ?? 0) +
                      (stats?.totalOverdueAmount ?? 0)
                    }
                  />
                </div>
              </div>

              {/* Dynamic Insights Box */}
              <div className="w-full mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                  Focus on collecting{" "}
                  <span className="text-rose-500 font-black">overdue</span>{" "}
                  invoices to maximize cash flow.
                  <span className="text-primary italic font-black tracking-tight block mt-1">
                    On track for millionaire by 35!
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

// 🎨 SUB-COMPONENT FOR REFINED CARDS
function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  color,
  isRawNumber = false,
  variant,
}: any) {
  const colorStyles = {
    emerald:
      "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20",
    amber:
      "text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-500/20",
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-200/20",
    rose: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 border-rose-500/20",
  };

  return (
    <motion.div variants={variant} className="h-full">
      <Card className="h-full border-none shadow-lg bg-card/40 backdrop-blur-sm group hover:bg-card/60 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70">
            {title}
          </CardTitle>
          <div
            className={cn(
              "p-2 rounded-xl border transition-transform group-hover:scale-110",
              colorStyles[color as keyof typeof colorStyles],
            )}
          >
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-black tracking-tighter">
            {!isRawNumber && "$"}
            {(value ?? 0).toLocaleString()}
          </div>
          {trend ? (
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase">
                {trend}
              </span>
            </div>
          ) : (
            <p className="text-[10px] font-medium text-muted-foreground/60 mt-1 uppercase tracking-tight">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
