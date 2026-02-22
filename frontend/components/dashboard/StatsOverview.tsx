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
import { cn } from "@/lib/utils";

interface StatsProps {
  stats: any;
}

export default function StatsOverview({ stats }: StatsProps) {
  // Animation variants for that smooth staggered entrance
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

      {/* --- BOTTOM ROW: VISUAL BREAKDOWN --- */}
      <motion.div variants={item}>
        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-md overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500" />
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="p-6 lg:col-span-1 border-r border-border/50">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-black tracking-tight">
                  Financial Health
                </CardTitle>
                <CardDescription>
                  Revenue vs. Outstanding Balance
                </CardDescription>
              </CardHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your current collection rate is looking healthy. Focus on the
                  <span className="text-rose-500 font-bold"> overdue</span>{" "}
                  invoices to maximize cash flow.
                </p>
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-xs font-bold text-primary italic">
                    On track for millionaire soon!
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 p-6 bg-muted/5 flex items-center justify-center">
              <div className="w-full max-w-[400px]">
                <PaidUnpaidPieChart
                  paid={stats?.totalPaidAmount ?? 0}
                  unpaid={
                    (stats?.totalPendingAmount ?? 0) +
                    (stats?.totalOverdueAmount ?? 0)
                  }
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
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
    <motion.div variants={variant}>
      <Card className="border-none shadow-lg bg-card/40 backdrop-blur-sm group hover:bg-card/60 transition-all duration-300">
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
