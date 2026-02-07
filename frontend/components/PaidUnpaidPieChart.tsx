"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from "recharts";

interface Props {
  paid: number;
  unpaid: number;
}

// ✅ Fix: Type the tooltip props properly
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-2 rounded-md shadow-md">
        <p className="text-sm font-semibold text-popover-foreground">
          {payload[0].name}
        </p>
        <p className="text-sm text-muted-foreground">
          ${payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function PaidUnpaidPieChart({ paid, unpaid }: Props) {
  const data = [
    { name: "Paid", value: paid },
    { name: "Unpaid", value: unpaid },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  if (paid === 0 && unpaid === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-muted-foreground text-sm">
        No financial data yet
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value) => (
              <span className="text-foreground ml-1">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
