"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { BestSellers } from "@/components/dashboard/best-sellers";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentOrders } from "@/components/dashboard/recent-orders";

const months = [
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

const years = [
  { value: "2024", label: "2024" },
  { value: "2025", label: "2025" },
  { value: "2026", label: "2026" },
];

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = React.useState("2"); // Default to February
  const [selectedYear, setSelectedYear] = React.useState("2026");

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            نظرة عامة على المتجر
          </h2>
          <p className="text-muted-foreground font-medium">
            أهلاً بكِ مجدداً في بيت السعادة، إليكِ آخر إحصائيات متجرك اليوم.
          </p>
        </div>
        <div className="w-full sm:w-auto flex items-center gap-2 bg-background border rounded-2xl p-2 self-start">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <CalendarIcon className="size-4" />
          </div>
          <div className="w-full flex items-center gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[120px] border-none bg-transparent focus:ring-0 font-bold">
                <SelectValue placeholder="الشهر" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem
                    key={m.value}
                    value={m.value}
                    className="font-bold"
                  >
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="h-4 w-px bg-border mx-1" />
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-[100px] border-none bg-transparent focus:ring-0 font-bold">
                <SelectValue placeholder="السنة" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem
                    key={y.value}
                    value={y.value}
                    className="font-bold"
                  >
                    {y.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <StatsCards month={selectedMonth} year={selectedYear} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 min-w-0">
          <RevenueChart month={selectedMonth} year={selectedYear} />
        </div>
        <div className="lg:col-span-1 min-w-0">
          <BestSellers />
        </div>
      </div>
      <div className="min-w-0">
        <RecentOrders />
      </div>
    </div>
  );
}
