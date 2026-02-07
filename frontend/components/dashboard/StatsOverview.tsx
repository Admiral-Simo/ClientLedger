"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DollarSign, Briefcase, Users } from "lucide-react";
import PaidUnpaidPieChart from "@/components/PaidUnpaidPieChart";

interface StatsProps {
  stats: any; // Ideally import the exact type from your API slice
}

export default function StatsOverview({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ${stats?.totalPaidAmount?.toLocaleString() ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Collected from paid invoices
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ${stats?.totalPendingAmount?.toLocaleString() ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Draft or active contracts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {stats?.totalClients ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">Total client base</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Overdue</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            ${stats?.totalOverdueAmount?.toLocaleString() ?? 0}
          </div>
          <p className="text-xs text-muted-foreground">Unpaid on time work</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Paid vs Unpaid</CardTitle>
          <CardDescription>Revenue breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <PaidUnpaidPieChart
            paid={stats?.totalPaidAmount ?? 0}
            unpaid={
              (stats?.totalPendingAmount ?? 0) +
              (stats?.totalOverdueAmount ?? 0)
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
