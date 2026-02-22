"use client";

import { useQuery } from "convex/react";
import { ShoppingBag } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentOrdersProps {
  isPast?: boolean;
  isCurrent?: boolean;
  isFuture?: boolean;
}

export function RecentOrders({
  isPast,
  isCurrent,
  isFuture,
}: RecentOrdersProps) {
  const orders = useQuery(api.dashboard.getRecentOrders, { limit: 5 });

  if (!orders) {
    return (
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-bold">آخر الطلبات</h3>
        <a
          href="/dashboard/orders"
          className="text-xs text-primary font-medium hover:underline"
        >
          عرض الكل
        </a>
      </div>
      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <ShoppingBag className="size-6 text-muted-foreground/50" />
            </div>
            <h4 className="font-bold text-foreground">
              {isCurrent
                ? "لا توجد طلبات"
                : isPast
                  ? "لا توجد طلبات سابقة"
                  : isFuture
                    ? "في انتظار الطلبات"
                    : "لا توجد طلبات"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {isCurrent
                ? "لم يتم العثور على أي طلبات في هذه الفترة."
                : isPast
                  ? "لم يتم العثور على أي طلبات مسجلة في هذا الشهر المنتهي."
                  : isFuture
                    ? "سيظهر هنا الطلبات الجديدة فور تسجيلها في هذا الشهر."
                    : "لا توجد طلبات."}
            </p>
          </div>
        ) : (
          <table className="w-full text-right text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-bold min-w-[140px] sm:min-w-0">
                  رقم الطلب
                </th>
                <th className="px-6 py-3 font-bold min-w-[200px] sm:min-w-0">
                  العميل
                </th>
                <th className="px-6 py-3 font-bold min-w-[220px] sm:min-w-0">
                  المنتج
                </th>
                <th className="px-6 py-3 font-bold min-w-[140px] sm:min-w-0">
                  المبلغ
                </th>
                <th className="px-6 py-3 font-bold text-center min-w-[140px] sm:min-w-0">
                  الحالة
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-primary min-w-[140px] sm:min-w-0">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 font-bold min-w-[200px] sm:min-w-0">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-bold min-w-[220px] sm:min-w-0">
                    {order.product}
                  </td>
                  <td className="px-6 py-4 font-bold min-w-[140px] sm:min-w-0">
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 min-w-[140px] sm:min-w-0">
                    <div className="flex justify-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.statusColor}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
