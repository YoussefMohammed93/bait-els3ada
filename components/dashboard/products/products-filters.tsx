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

const categories = [
  { value: "all", label: "جميع التصنيفات" },
  { value: "مكياج", label: "مكياج" },
  { value: "عناية بالبشرة", label: "عناية بالبشرة" },
  { value: "عطور", label: "عطور" },
  { value: "إكسسوارات", label: "إكسسوارات" },
  { value: "هدايا", label: "هدايا" },
  { value: "شنط", label: "شنط" },
];

const stockStatuses = [
  { value: "all", label: "جميع الحالات" },
  { value: "متوفر", label: "متوفر" },
  { value: "كمية قليلة", label: "كمية قليلة" },
  { value: "غير متوفر", label: "غير متوفر" },
];

const sortOptions = [
  { value: "newest", label: "الأحدث أولاً" },
  { value: "oldest", label: "الأقدم أولاً" },
  { value: "price-high", label: "السعر: من الأعلى" },
  { value: "price-low", label: "السعر: من الأقل" },
  { value: "name", label: "الاسم" },
];

interface ProductsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  stockStatus: string;
  onStockStatusChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  onReset: () => void;
}

export function ProductsFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  stockStatus,
  onStockStatusChange,
  sortBy,
  onSortByChange,
  onReset,
}: ProductsFiltersProps) {
  const hasFilters =
    search !== "" ||
    category !== "all" ||
    stockStatus !== "all" ||
    sortBy !== "newest";

  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن منتج..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10 rounded-xl h-10 bg-muted/50 border-0 focus-visible:ring-1 font-medium"
          />
        </div>

        {/* Category */}
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full sm:w-[150px] rounded-xl h-10 bg-muted/50 border-0 font-bold">
            <SelectValue placeholder="التصنيف" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value} className="font-bold">
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Stock Status */}
        <Select value={stockStatus} onValueChange={onStockStatusChange}>
          <SelectTrigger className="w-full sm:w-[150px] rounded-xl h-10 bg-muted/50 border-0 font-bold">
            <SelectValue placeholder="حالة المخزون" />
          </SelectTrigger>
          <SelectContent>
            {stockStatuses.map((s) => (
              <SelectItem key={s.value} value={s.value} className="font-bold">
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-full sm:w-[160px] rounded-xl h-10 bg-muted/50 border-0 font-bold">
            <SelectValue placeholder="ترتيب حسب" />
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
        {hasFilters && (
          <Button
            variant="default"
            onClick={onReset}
            className="w-full sm:w-auto rounded-xl h-10 gap-1.5"
          >
            <RotateCcw className="size-3.5" />
            إعادة تعيين
          </Button>
        )}
      </div>
    </div>
  );
}
