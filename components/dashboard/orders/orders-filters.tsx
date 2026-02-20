"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

const statuses = [
  { value: "all", label: "جميع الحالات" },
  { value: "مكتمل", label: "مكتمل" },
  { value: "قيد التنفيذ", label: "قيد التنفيذ" },
  { value: "جاري الشحن", label: "جاري الشحن" },
  { value: "ملغي", label: "ملغي" },
];

const sortOptions = [
  { value: "newest", label: "الأحدث أولاً" },
  { value: "oldest", label: "الأقدم أولاً" },
  { value: "amount-high", label: "الأعلى مبلغاً" },
  { value: "amount-low", label: "الأقل مبلغاً" },
];

interface OrdersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export function OrdersFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortChange,
  onReset,
}: OrdersFiltersProps) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="ابحث برقم الطلب أو اسم العميل..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10 rounded-xl h-10 font-medium"
          />
        </div>

        {/* Status */}
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full sm:w-[160px] rounded-xl h-10 font-bold">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s.value} value={s.value} className="font-bold">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[160px] rounded-xl h-10 font-bold">
            <SelectValue placeholder="الترتيب" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((s) => (
              <SelectItem key={s.value} value={s.value} className="font-bold">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset */}
        {(search || status !== "all" || sortBy !== "newest") && (
          <Button
            variant="default"
            onClick={onReset}
            className="w-full sm:w-auto rounded-xl h-10 gap-1.5 animate-in fade-in zoom-in duration-300"
          >
            <RotateCcw className="size-3.5" />
            إعادة تعيين
          </Button>
        )}
      </div>
    </div>
  );
}
