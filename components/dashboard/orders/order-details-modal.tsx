"use client";

import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  User,
  CreditCard,
  CalendarDays,
  ShoppingBag,
  Phone,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order } from "./orders-table";

interface OrderDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const statusConfig: Record<
  string,
  { className: string; Icon: React.ElementType; label: string }
> = {
  مكتمل: {
    className: "bg-emerald-500/10 text-emerald-600",
    Icon: CheckCircle2,
    label: "مكتمل",
  },
  "قيد التنفيذ": {
    className: "bg-blue-500/10 text-blue-600",
    Icon: Clock,
    label: "قيد التنفيذ",
  },
  "جاري الشحن": {
    className: "bg-orange-500/10 text-orange-600",
    Icon: Truck,
    label: "جاري الشحن",
  },
  ملغي: {
    className: "bg-destructive/10 text-destructive",
    Icon: XCircle,
    label: "ملغي",
  },
};

export function OrderDetailsModal({
  open,
  onOpenChange,
  order,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const { className: statusClass, Icon: StatusIcon } =
    statusConfig[order.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-lg max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-lg font-bold text-foreground">
            تفاصيل الطلب {order.id}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground font-medium">
            معلومات كاملة عن هذا الطلب وإدارة الحالات
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 pb-4 pt-4 space-y-6">
          {/* Status Changer */}
          <div className="p-4 rounded-xl bg-white border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">
                تحديث حالة الطلب
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusClass}`}
              >
                <StatusIcon className="size-3.5" />
                {order.status}
              </span>
            </div>
            <Select defaultValue={order.status}>
              <SelectTrigger className="w-full rounded-xl border-muted-foreground/20 font-bold h-11">
                <SelectValue placeholder="اختر حالة جديدة" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key} className="font-bold">
                    <div className="flex items-center gap-2">
                      <config.Icon className="size-4" />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <hr className="border-foreground/10" />

          {/* Customer Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-card border group">
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground font-bold mb-0.5">
                  العميل
                </p>
                <p className="font-bold text-foreground text-sm">
                  {order.customer}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                <User className="size-5" />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-card border group">
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground font-bold mb-0.5">
                  رقم الهاتف
                </p>
                <p
                  className="font-bold text-foreground text-sm tabular-nums"
                  dir="ltr"
                >
                  {order.phone}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
                <Phone className="size-5" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-card border group">
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground font-bold mb-0.5">
                  طريقة الدفع
                </p>
                <p className="font-bold text-foreground text-sm">
                  {order.paymentMethod}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-100">
                <CreditCard className="size-5" />
              </div>
            </div>

            {/* Order Date */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-card border group">
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground font-bold mb-0.5">
                  تاريخ الطلب
                </p>
                <p className="font-bold text-foreground text-sm tabular-nums">
                  {order.date}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-100">
                <CalendarDays className="size-5" />
              </div>
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-card border group">
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground font-bold mb-0.5">
                العنوان
              </p>
              <p className="font-bold text-foreground text-sm">
                {order.address}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-100">
              <MapPin className="size-5" />
            </div>
          </div>

          <hr className="border-foreground/10" />

          {/* Products */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <ShoppingBag className="size-4 text-muted-foreground" />
              المنتجات المطلوبة ({order.products.length})
            </h4>
            <div className="space-y-2">
              {order.products.map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white border group transition-all"
                >
                  <div className="relative size-14 rounded-xl overflow-hidden border bg-white shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground font-bold">
                        الكمية:{" "}
                        <span className="text-foreground">
                          {product.quantity}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground font-bold">
                        السعر:{" "}
                        <span className="text-foreground tabular-nums">
                          {product.price.toLocaleString("ar-EG")} ج.م
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white border">
            <span className="text-sm font-bold text-muted-foreground">
              إجمالي الطلب
            </span>
            <span className="text-xl font-bold text-primary tabular-nums">
              {order.amount.toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
