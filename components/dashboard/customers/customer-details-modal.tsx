"use client";

import {
  User,
  Phone,
  Mail,
  MapPin,
  ShoppingCart,
  Wallet,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Customer } from "./customers-table";

interface CustomerDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

export function CustomerDetailsModal({
  open,
  onOpenChange,
  customer,
}: CustomerDetailsModalProps) {
  if (!customer) return null;

  const isActive = customer.status === "نشط";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b bg-muted/30">
          <div className="flex items-start gap-4">
            <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <User className="size-7 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xl font-bold text-foreground">
                {customer.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {isActive ? (
                    <CheckCircle2 className="size-3" />
                  ) : (
                    <XCircle className="size-3" />
                  )}
                  {customer.status}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-muted-foreground">
              معلومات التواصل
            </h4>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100/50 text-blue-600 shrink-0">
                  <Phone className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    رقم الهاتف
                  </p>
                  <p
                    className="text-sm font-bold text-foreground tabular-nums"
                    dir="ltr"
                  >
                    {customer.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-violet-100/50 text-violet-600 shrink-0">
                  <Mail className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    البريد الإلكتروني
                  </p>
                  <p className="text-sm font-bold text-foreground" dir="ltr">
                    {customer.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-100/50 text-orange-600 shrink-0">
                  <MapPin className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    العنوان
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {customer.address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-dashed" />

          {/* Stats */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-muted-foreground">
              إحصائيات العميل
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-muted/20 p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <ShoppingCart className="size-4 text-blue-600" />
                  <span className="text-xs font-bold text-muted-foreground">
                    عدد الطلبات
                  </span>
                </div>
                <p className="text-xl font-bold text-foreground tabular-nums">
                  {customer.totalOrders}
                </p>
              </div>
              <div className="rounded-xl border bg-muted/20 p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <Wallet className="size-4 text-emerald-600" />
                  <span className="text-xs font-bold text-muted-foreground">
                    إجمالي الإنفاق
                  </span>
                </div>
                <p className="text-xl font-bold text-foreground tabular-nums">
                  {customer.totalSpent.toLocaleString("ar-EG")} ج.م
                </p>
              </div>
            </div>
          </div>

          <hr className="border-dashed" />

          {/* Dates */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-muted-foreground">
              التواريخ
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-100/50 text-emerald-600 shrink-0">
                  <CalendarDays className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    تاريخ الانضمام
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {customer.joinDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100/50 text-blue-600 shrink-0">
                  <Clock className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">
                    آخر طلب
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {customer.lastOrderDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
