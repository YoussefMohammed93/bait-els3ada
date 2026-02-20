"use client";

import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  status: "نشط" | "غير نشط";
  joinDate: string;
  lastOrderDate: string;
}

interface CustomersTableProps {
  customers: Customer[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (customer: Customer) => void;
}

const statusConfig: Record<
  string,
  { className: string; Icon: React.ElementType }
> = {
  نشط: {
    className: "bg-emerald-500/10 text-emerald-600",
    Icon: CheckCircle2,
  },
  "غير نشط": {
    className: "bg-destructive/10 text-destructive",
    Icon: XCircle,
  },
};

export function CustomersTable({
  customers,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
}: CustomersTableProps) {
  return (
    <div>
      {/* ── Desktop Table ── */}
      <div className="hidden md:block rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm min-w-[900px]">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold">الاسم</th>
                <th className="px-5 py-3.5 font-bold">رقم الهاتف</th>
                <th className="px-5 py-3.5 font-bold">البريد الإلكتروني</th>
                <th className="px-5 py-3.5 font-bold">عدد الطلبات</th>
                <th className="px-5 py-3.5 font-bold">إجمالي الإنفاق</th>
                <th className="px-5 py-3.5 font-bold text-center">الحالة</th>
                <th className="px-5 py-3.5 font-bold">تاريخ الانضمام</th>
                <th className="px-5 py-3.5 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((customer) => {
                const { className: statusClass, Icon: StatusIcon } =
                  statusConfig[customer.status];
                return (
                  <tr
                    key={customer.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-5 py-3 font-bold text-foreground">
                      {customer.name}
                    </td>
                    <td
                      className="px-5 py-3 text-muted-foreground font-medium text-sm tabular-nums"
                      dir="ltr"
                    >
                      {customer.phone}
                    </td>
                    <td
                      className="px-5 py-3 text-muted-foreground font-medium text-sm"
                      dir="ltr"
                    >
                      {customer.email}
                    </td>
                    <td className="px-5 py-3 font-bold text-foreground tabular-nums">
                      {customer.totalOrders}
                    </td>
                    <td className="px-5 py-3 font-bold text-sm tabular-nums whitespace-nowrap">
                      {customer.totalSpent.toLocaleString("ar-EG")} ج.م
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusClass}`}
                        >
                          <StatusIcon className="size-3.5" />
                          {customer.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground font-medium text-xs whitespace-nowrap">
                      {customer.joinDate}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(customer)}
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
        {customers.map((customer) => {
          const { className: statusClass, Icon: StatusIcon } =
            statusConfig[customer.status];
          return (
            <div
              key={customer.id}
              className="rounded-2xl border bg-card p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground text-base">
                  {customer.name}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${statusClass}`}
                >
                  <StatusIcon className="size-3.5" />
                  {customer.status}
                </span>
              </div>

              <div className="space-y-1">
                <p
                  className="text-xs text-muted-foreground font-medium"
                  dir="ltr"
                >
                  {customer.phone}
                </p>
                <p
                  className="text-xs text-muted-foreground font-medium"
                  dir="ltr"
                >
                  {customer.email}
                </p>
              </div>

              <div className="flex items-center justify-between gap-6 border-t pt-3 text-sm">
                <div>
                  <span className="text-sm text-muted-foreground font-bold block">
                    الطلبات
                  </span>
                  <span className="font-bold text-foreground text-sm tabular-nums">
                    {customer.totalOrders}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground font-bold block">
                    الإنفاق
                  </span>
                  <span className="font-bold text-foreground text-sm tabular-nums">
                    {customer.totalSpent.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground font-bold block">
                    الانضمام
                  </span>
                  <span className="font-bold text-muted-foreground text-sm">
                    {customer.joinDate}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(customer)}
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
