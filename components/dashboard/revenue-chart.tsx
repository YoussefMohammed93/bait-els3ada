"use client";

import {
  Area,
  AreaChart,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "convex/react";
import { BarChart3 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useEffect, useRef, useState } from "react";

const monthsData = [
  { value: "1", label: "يناير" },
  { value: "2", label: "فبراير" },
  { value: "3", label: "مارس" },
  { value: "4", label: "أبريل" },
  { value: "5", label: "مايو" },
  { value: "6", label: "يونيو" },
  { value: "7", label: "يوليو" },
  { value: "8", label: "أغسطس" },
  { value: "9", label: "سبتمبر" },
  { value: "10", label: "أكتوبر" },
  { value: "11", label: "نوفمبر" },
  { value: "12", label: "ديسمبر" },
];

interface TooltipEntry {
  value: number;
  name: string;
  color: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="bg-background border border-border p-4 rounded-2xl shadow-xl flex flex-col gap-2 font-tajawal text-right min-w-[140px]"
        dir="rtl"
      >
        <p className="font-bold text-base border-b pb-1 mb-1">يوم {label}</p>
        {[...payload].reverse().map((entry, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 text-sm font-medium"
          >
            <span
              style={{
                color: entry.dataKey === "orders" ? "#7dd3fc" : entry.color,
              }}
              className="flex items-center gap-1"
            >
              {entry.name}:
            </span>
            <span className="font-bold">
              {entry.value.toLocaleString()}
              {entry.dataKey === "sales" ? " ج.م" : ""}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface RevenueChartProps {
  month: string;
  year: string;
  isPast?: boolean;
  isCurrent?: boolean;
  isFuture?: boolean;
}

export function RevenueChart({
  month,
  year,
  isPast,
  isCurrent,
  isFuture,
}: RevenueChartProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const revenueData = useQuery(api.dashboard.getRevenueData, { month, year });

  const selectedMonthLabel =
    monthsData.find((m) => m.value === month)?.label || "الشهر";

  useEffect(() => {
    setMounted(true);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.scrollWidth;
    }
  }, [revenueData]);

  const isEmpty = revenueData?.every((d) => d.sales === 0 && d.orders === 0);

  if (!mounted || !revenueData) {
    return (
      <div className="w-full rounded-2xl border bg-card p-6 min-h-[500px] flex flex-col gap-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40 rounded-full" />
        </div>
        <Skeleton className="flex-1 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border bg-card p-6 overflow-hidden min-h-[500px] flex flex-col">
      <div className="mb-8 flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-foreground">
            إحصائيات {selectedMonthLabel} {year}
          </h3>
          <p className="text-xs text-muted-foreground font-medium">
            نظرة تفصيلية على أداء المتجر خلال هذه الفترة.
          </p>
        </div>
        <div
          className="flex gap-6 text-sm font-bold bg-muted/30 px-4 py-2 rounded-full"
          dir="rtl"
        >
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-primary" />
            <span className="text-muted-foreground font-bold">المبيعات</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-sky-300" />
            <span className="text-muted-foreground font-bold">الطلبات</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative flex flex-col">
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BarChart3 className="size-8 text-muted-foreground/50" />
            </div>
            <h4 className="text-lg font-bold text-foreground mb-1">
              {isCurrent
                ? "لا توجد بيانات متاحة"
                : isPast
                  ? "انتهى الشهر"
                  : isFuture
                    ? "لم يبدأ الشهر بعد"
                    : "لا توجد بيانات"}
            </h4>
            <p className="text-sm text-muted-foreground max-w-[280px]">
              {isCurrent
                ? `ليس هناك مبيعات أو طلبات مسجلة في شهر ${selectedMonthLabel} ${year} حتى الآن.`
                : isPast
                  ? `هذا الشهر انتهى، ولم يتم تسجيل أي نشاط مبيعات خلاله.`
                  : isFuture
                    ? `هذا الشهر في المستقبل، سنعرض الإحصائيات هنا بمجرد بدئه.`
                    : `لا توجد بيانات متاحة.`}
            </p>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide flex-1"
          >
            <div className="h-[400px] min-w-[900px] w-full" dir="ltr">
              <ResponsiveContainer
                width="100%"
                height="100%"
                className="!ml-12 sm:ml-0"
              >
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 40 }}
                >
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorOrders"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#7dd3fc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="5 5"
                    vertical={false}
                    stroke="hsl(var(--border))"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 13,
                      fontWeight: 700,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    dy={20}
                    reversed={true}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fontWeight: 700,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    orientation="right"
                    tickFormatter={(value) => value.toLocaleString()}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{
                      stroke: "hsl(var(--primary))",
                      strokeWidth: 1.5,
                      strokeDasharray: "4 4",
                    }}
                  />
                  <Area
                    name="المبيعات"
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                    activeDot={{
                      r: 8,
                      strokeWidth: 0,
                      fill: "hsl(var(--primary))",
                    }}
                  />
                  <Area
                    name="الطلبات"
                    type="monotone"
                    dataKey="orders"
                    stroke="#7dd3fc"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    activeDot={{ r: 5, strokeWidth: 0, fill: "#7dd3fc" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
