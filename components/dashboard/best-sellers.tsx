"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

interface BestSellersProps {
  month?: string;
  year?: string;
  isPast?: boolean;
  isCurrent?: boolean;
  isFuture?: boolean;
}

export function BestSellers({
  month,
  year,
  isPast,
  isCurrent,
  isFuture,
}: BestSellersProps) {
  const products = useQuery(api.dashboard.getBestSellers, {
    limit: 5,
    month: month,
    year: year,
  });

  if (!products) {
    return (
      <div className="rounded-2xl border bg-card sm:h-full flex flex-col overflow-hidden sm:min-h-[460px]">
        <div className="px-6 py-4 border-b">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="flex-1 p-6 space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="size-14 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card sm:h-full flex flex-col overflow-hidden sm:min-h-[460px]">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-bold">المنتجات الأكثر مبيعاً</h3>
      </div>
      {products.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/5">
          <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Star className="size-6 text-muted-foreground/30" />
          </div>
          <h4 className="font-bold text-foreground">
            {isCurrent
              ? "لا توجد بيانات"
              : isPast
                ? "لا توجد سجلات"
                : isFuture
                  ? "في انتظار البيانات"
                  : "لا توجد بيانات"}
          </h4>
          <p className="text-sm text-muted-foreground">
            {isCurrent
              ? "سيتم عرض أفضل منتجاتك هنا قريباً."
              : isPast
                ? "لم يتم تسجيل أي مبيعات في هذا الشهر المنتهي."
                : isFuture
                  ? "سيتم عرض أفضل منتجاتك هنا بمجرد بدء الشهر."
                  : "لا توجد بيانات."}
          </p>
        </div>
      ) : (
        <div className="flex-1 p-6 sm:space-y-6 flex sm:flex-col items-start overflow-x-auto sm:overflow-x-hidden sm:overflow-y-auto gap-4 sm:gap-0 scrollbar-hide">
          {products.map((product, index) => (
            <div
              key={`${product.name}-${index}`}
              className="flex sm:flex-row flex-col items-center sm:items-center gap-4 group min-w-[160px] sm:min-w-0"
            >
              <div className="relative size-20 sm:size-14 rounded-xl bg-muted overflow-hidden flex-shrink-0 border items-center justify-center flex p-1">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <div className="flex-1 min-w-0 text-center sm:text-right">
                <h4 className="font-bold text-sm truncate w-full">
                  {product.name}
                </h4>
                <p className="text-xs text-muted-foreground font-bold">
                  {product.category}
                </p>
              </div>
              <div className="text-center sm:text-right flex-shrink-0">
                <p className="text-sm font-bold text-primary">
                  {product.sales} قطعة
                </p>
                <p className="text-[10px] text-muted-foreground font-bold">
                  {product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
