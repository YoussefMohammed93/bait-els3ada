"use client";

import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ShoppingBag,
  Loader2,
  Download,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NextImage from "next/image";
import { toPng } from "html-to-image";
import { useState, useRef } from "react";
import { useCart } from "@/hooks/use-cart";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MyOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: Id<"orders">;
  _creationTime: number;
  createdAt: number;
  sessionId: string;
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

const statusConfig = {
  pending: {
    label: "قيد الانتظار",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  processing: {
    label: "جاري التجهيز",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Package,
  },
  shipped: {
    label: "تم الشحن",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Truck,
  },
  completed: {
    label: "تم التوصيل",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "ملغي",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: XCircle,
  },
  declined: {
    label: "ملغي",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: XCircle,
  },
};

export function MyOrdersDialog({ open, onOpenChange }: MyOrdersDialogProps) {
  const { sessionId } = useCart();
  const orders = useQuery(api.orders.getOrders, { sessionId: sessionId || "" });
  const cancelOrder = useMutation(api.orders.cancelOrder);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancel = async (orderId: Id<"orders">) => {
    setCancellingId(orderId);
    try {
      await cancelOrder({ orderId });
      toast.success("تم إلغاء الطلب بنجاح");
    } catch {
      toast.error("حدث خطأ أثناء إلغاء الطلب");
    } finally {
      setCancellingId(null);
    }
  };

  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(
    null,
  );

  const handleDownloadInvoice = async (order: Order) => {
    setActiveInvoiceOrder(order);
    setIsDownloading(order._id);

    // Give state time to render the template
    setTimeout(async () => {
      if (!invoiceRef.current) {
        setIsDownloading(null);
        return;
      }

      try {
        const dataUrl = await toPng(invoiceRef.current, {
          quality: 0.95,
          backgroundColor: "#ffffff",
          cacheBust: true,
          pixelRatio: 2,
        });

        const link = document.createElement("a");
        link.download = `فاتورة-بيت-السعادة-${order._id.toString().slice(-6)}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("تم تحميل الفاتورة بنجاح");
      } catch (error) {
        console.error("Capture error:", error);
        toast.error("حدث خطأ أثناء تحميل الفاتورة");
      } finally {
        setIsDownloading(null);
        setActiveInvoiceOrder(null);
      }
    }, 200);
  };

  const formatDateRTL = (date: number) => {
    return new Intl.DateTimeFormat("ar-EG", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] [&>button]:top-5 sm:[&>button]:top-6   sm:!max-w-[700px] p-0 overflow-hidden bg-white rounded-[24px] sm:rounded-[32px] gap-0 rtl"
        dir="rtl"
      >
        <DialogHeader className="p-4 sm:!p-5 border-b bg-muted/5">
          <DialogTitle className="text-lg sm:text-xl font-black flex items-center gap-3">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            طلباتي
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="p-4 space-y-4">
            {orders === undefined ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium text-sm">
                  جاري تحميل طلباتك...
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-xl font-black mb-2">لا توجد طلبات بعد</h3>
                <p className="text-muted-foreground font-medium text-sm max-w-[280px] sm:max-w-[480px]">
                  ابدأ التسوق الآن وسيظهر سجل طلباتك هنا لتتمكن من متابعتها.
                </p>
                <Button
                  variant="outline"
                  className="mt-6 rounded-xl font-bold bg-muted hover:bg-muted/80"
                  onClick={() => onOpenChange(false)}
                >
                  <Link href="/products">تصفح المنتجات</Link>
                </Button>
              </div>
            ) : (
              (orders as unknown as Order[]).map((order) => {
                const config =
                  statusConfig[order.status as keyof typeof statusConfig] ||
                  statusConfig.pending;
                const StatusIcon = config.icon;

                return (
                  <div
                    key={order._id}
                    className="p-4 sm:p-5 border border-border/50 rounded-[20px] sm:rounded-[24px] bg-white transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 group"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-end sm:items-start gap-3 sm:gap-0 mb-4">
                      <div className="space-y-1">
                        <div className="flex flex-row-reverse sm:flex-row items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                            : رقم الطلب
                          </span>
                          <span className="text-xs font-bold text-foreground">
                            #{order._id.toString().slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-muted-foreground mr-1">
                          {formatDateRTL(order.createdAt)}
                        </p>
                      </div>
                      <Badge
                        className={`rounded-xl px-2.5 py-0.5 sm:px-3 sm:py-1 border font-bold text-[10px] sm:text-[11px] gap-1.5 ${config.color}`}
                        variant="outline"
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map(
                        (
                          item: {
                            productName: string;
                            price: number;
                            quantity: number;
                          },
                          idx: number,
                        ) => (
                          <div
                            key={idx}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-foreground font-medium">
                              {item.productName}{" "}
                              <span className="text-muted-foreground text-xs">
                                x{item.quantity}
                              </span>
                            </span>
                            <span className="font-bold">
                              {item.price * item.quantity} ج.م
                            </span>
                          </div>
                        ),
                      )}
                    </div>

                    <div className="pt-4 border-t border-dashed border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                          الإجمالي الكلي
                        </span>
                        <span className="text-base sm:text-lg font-black text-primary">
                          {order.totalAmount} ج.م
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isDownloading === order._id}
                          onClick={() => handleDownloadInvoice(order)}
                          className="h-9 w-full sm:w-auto px-4 rounded-xl font-bold text-xs gap-2 bg-muted hover:bg-muted/80 disabled:opacity-50"
                        >
                          {isDownloading === order._id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          تحميل الفاتورة
                        </Button>

                        {order.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={cancellingId === order._id}
                            onClick={() => handleCancel(order._id)}
                            className="text-red-500 w-full sm:w-auto hover:text-red-600 hover:bg-red-50 rounded-xl font-bold h-9 px-4 gap-2"
                          >
                            {cancellingId === order._id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            إلغاء الطلب
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Singleton Hidden Capturable Invoice Content */}
        <div
          className="fixed top-[-9999px] left-0 pointer-events-none opacity-0"
          aria-hidden="true"
        >
          {activeInvoiceOrder && (
            <div
              ref={invoiceRef}
              className="w-[800px] bg-white p-12 text-right dir-rtl"
              dir="rtl"
              style={{ fontFamily: "var(--font-tajawal), sans-serif" }}
            >
              <div className="flex justify-between items-start border-b-4 border-primary/10 pb-10 mb-10">
                <div className="space-y-4">
                  <h1 className="text-5xl font-black text-primary mb-2">
                    فاتورة شراء
                  </h1>
                  <p className="text-xl font-bold text-slate-500">
                    رقم الطلب:{" "}
                    <span className="text-slate-900 font-black">
                      #
                      {activeInvoiceOrder._id
                        .toString()
                        .slice(-8)
                        .toUpperCase()}
                    </span>
                  </p>
                  <div className="bg-muted p-3 rounded-2xl inline-block">
                    <p className="text-base font-black text-primary/80">
                      {formatDateRTL(activeInvoiceOrder.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <div className="w-24 h-24 relative rounded-3xl overflow-hidden shadow-xl">
                    <NextImage
                      src="/logo.jpeg"
                      alt="Logo"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900">
                    بيت السعادة
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-16 mb-12">
                <div className="bg-slate-50 p-8 rounded-[32px] space-y-4 border border-slate-100">
                  <h3 className="text-sm font-black text-primary/50 uppercase tracking-widest">
                    بيانات العميل
                  </h3>
                  <p className="text-2xl font-black text-slate-900">
                    {activeInvoiceOrder.customerName}
                  </p>
                  <p className="text-lg font-bold text-slate-600">
                    {activeInvoiceOrder.phone}
                  </p>
                </div>
                <div className="bg-slate-50 p-8 rounded-[32px] space-y-4 border border-slate-100">
                  <h3 className="text-sm font-black text-primary/50 uppercase tracking-widest">
                    عنوان التوصيل
                  </h3>
                  <p className="text-xl font-bold text-slate-800">
                    {activeInvoiceOrder.governorate}
                  </p>
                  <p className="text-lg font-medium text-slate-600 leading-relaxed">
                    {activeInvoiceOrder.address}
                  </p>
                </div>
              </div>

              <div className="mb-12 rounded-[32px] border-2 border-slate-50 overflow-hidden shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="py-6 px-8 text-right font-black text-lg">
                        المنتج
                      </th>
                      <th className="py-6 px-8 text-center font-black text-lg">
                        الكمية
                      </th>
                      <th className="py-6 px-8 text-left font-black text-lg">
                        السعر
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-50">
                    {activeInvoiceOrder.items.map(
                      (
                        item: {
                          productName: string;
                          price: number;
                          quantity: number;
                        },
                        i: number,
                      ) => (
                        <tr
                          key={i}
                          className={
                            i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                          }
                        >
                          <td className="py-6 px-8 font-bold text-xl text-slate-800">
                            {item.productName}
                          </td>
                          <td className="py-6 px-8 text-center font-black text-xl text-slate-900">
                            x{item.quantity}
                          </td>
                          <td className="py-6 px-8 text-left font-black text-xl text-primary">
                            {item.price} ج.م
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-start items-end gap-10">
                <div className="flex-1 space-y-4">
                  <div className="p-6 bg-emerald-50 text-emerald-700 rounded-3xl border border-emerald-100 flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-bold text-lg">
                      تم تسجيل الطلب بنجاح وهو &quot;قيد التنفيذ&quot;
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm font-bold mr-2 italic">
                    شكراً لاختياركم بيت السعادة - Bait Els3ada
                  </p>
                </div>

                <div className="w-[320px] bg-slate-50 p-8 rounded-[40px] text-slate-900 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10 opacity-70">
                    <span className="font-bold text-lg">الشحن</span>
                    <span className="font-black text-xl">50 ج.م</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-black">الإجمالي</span>
                    <span className="text-4xl font-black text-primary">
                      {activeInvoiceOrder.totalAmount}{" "}
                      <span className="text-sm">ج.م</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-slate-100 text-center">
                <p className="text-slate-300 font-black text-xs uppercase tracking-[0.2em]">
                  bait els3ada | luxury houseware
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
