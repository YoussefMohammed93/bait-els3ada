"use client";

import {
  CheckCircle2,
  XCircle,
  Truck,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface OrderProduct {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  amount: number;
  status: "مكتمل" | "قيد التنفيذ" | "جاري الشحن" | "ملغي";
  paymentMethod: string;
  date: string;
}

interface OrdersTableProps {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (order: Order) => void;
}

const statusConfig: Record<
  string,
  { className: string; Icon: React.ElementType }
> = {
  مكتمل: {
    className: "bg-emerald-500/10 text-emerald-600",
    Icon: CheckCircle2,
  },
  "قيد التنفيذ": {
    className: "bg-blue-500/10 text-blue-600",
    Icon: Clock,
  },
  "جاري الشحن": {
    className: "bg-orange-500/10 text-orange-600",
    Icon: Truck,
  },
  ملغي: {
    className: "bg-destructive/10 text-destructive",
    Icon: XCircle,
  },
};

export function OrdersTable({
  orders,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
}: OrdersTableProps) {
  return (
    <div>
      {/* ── Desktop Table ── */}
      <div className="hidden md:block rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm min-w-[860px]">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">رقم الطلب</th>
                <th className="px-5 py-3.5 font-bold">العميل</th>
                <th className="px-5 py-3.5 font-bold">المنتجات</th>
                <th className="px-5 py-3.5 font-bold">المبلغ</th>
                <th className="px-5 py-3.5 font-bold">طريقة الدفع</th>
                <th className="px-5 py-3.5 font-bold text-center">الحالة</th>
                <th className="px-5 py-3.5 font-bold">التاريخ</th>
                <th className="px-5 py-3.5 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => {
                const { className: statusClass, Icon: StatusIcon } =
                  statusConfig[order.status];
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3 font-bold text-primary">
                      {order.id}
                    </td>
                    <td className="px-5 py-3 font-bold text-foreground">
                      {order.customer}
                    </td>
                    <td className="px-5 py-3 max-w-[200px]">
                      <p className="text-sm text-muted-foreground font-medium line-clamp-1">
                        {order.products.map((p) => p.name).join("، ")}
                      </p>
                    </td>
                    <td className="px-5 py-3 font-bold text-sm tabular-nums whitespace-nowrap">
                      {order.amount.toLocaleString("ar-EG")} ج.م
                    </td>
                    <td className="px-5 py-3 text-muted-foreground font-medium text-sm">
                      {order.paymentMethod}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusClass}`}
                        >
                          <StatusIcon className="size-3.5" />
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground font-medium text-xs whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(order)}
                          className="rounded-lg h-8 px-2.5 text-xs font-bold gap-1 text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Eye className="size-3.5" />
                          عرض
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="md:hidden space-y-3">
        {orders.map((order) => {
          const { className: statusClass, Icon: StatusIcon } =
            statusConfig[order.status];
          return (
            <div
              key={order.id}
              className="rounded-2xl border bg-card p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-sm">
                  {order.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${statusClass}`}
                >
                  <StatusIcon className="size-3.5" />
                  {order.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <p className="font-bold text-foreground text-base">
                  {order.customer}
                </p>
                <p className="text-xs text-muted-foreground font-medium line-clamp-2">
                  {order.products.map((p) => p.name).join("، ")}
                </p>
              </div>

              <div className="flex items-center justify-between gap-6 border-t pt-3 text-sm">
                <div>
                  <span className="text-sm text-muted-foreground font-bold block">
                    المبلغ
                  </span>
                  <span className="font-bold text-foreground text-sm tabular-nums">
                    {order.amount.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground font-bold block">
                    الدفع
                  </span>
                  <span className="font-bold text-foreground text-sm">
                    {order.paymentMethod}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground font-bold block">
                    التاريخ
                  </span>
                  <span className="font-bold text-muted-foreground text-sm">
                    {order.date}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(order)}
                className="w-full rounded-xl h-9 text-xs font-bold gap-1.5 text-primary border-primary/20 hover:bg-primary/5"
              >
                <Eye className="size-3.5" />
                عرض التفاصيل
              </Button>
            </div>
          );
        })}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-muted-foreground font-medium">
            صفحة {currentPage} من {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                className="size-8 rounded-lg text-xs font-bold"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
