"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Truck,
  Smartphone,
  CheckCircle2,
  ChevronLeft,
  Download,
  Loader2,
} from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import NextImage from "next/image";
import { toPng } from "html-to-image";
import { useMutation } from "convex/react";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

const GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "المنوفية",
  "القليوبية",
  "البحيرة",
  "الغربية",
  "بور سعيد",
  "دمياط",
  "الإسماعيلية",
  "السويس",
  "كفر الشيخ",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "الوادي الجديد",
  "مطروح",
];

interface CheckoutDialogProps {
  subtotal: number;
  shipping: number;
  total: number;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface SummaryItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface SummaryData {
  _id: string;
  items: SummaryItem[];
  totalAmount: number;
  customerName: string;
  phone: string;
  address: string;
  governorate: string;
  createdAt: number;
  paymentMethod: string;
  senderWallet?: string;
}

export function CheckoutDialog({
  subtotal,
  shipping,
  total,
  onSuccess,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CheckoutDialogProps) {
  const router = useRouter();
  const { sessionId, clearCart } = useCart();
  const createOrder = useMutation(api.orders.createOrder);

  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen =
    controlledOnOpenChange !== undefined
      ? controlledOnOpenChange
      : setInternalOpen;

  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<SummaryData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    governorate: "",
    address: "",
    paymentMethod: "cod",
    senderWallet: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "يرجى إدخال الاسم بالكامل";
    if (!formData.phone.trim()) newErrors.phone = "يرجى إدخال رقم الهاتف";
    else if (!/^01[0125][0-9]{8}$/.test(formData.phone))
      newErrors.phone = "رقم الهاتف غير صحيح";
    if (!formData.governorate) newErrors.governorate = "يرجى اختيار المحافظة";
    if (!formData.address.trim())
      newErrors.address = "يرجى إدخال العنوان بالتفصيل";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "يرجى اختيار طريقة الدفع";
    if (formData.paymentMethod === "vodafone" && !formData.senderWallet.trim())
      newErrors.senderWallet = "يرجى إدخال رقم محفظة فودافون كاش المرسل منها";
    else if (
      formData.paymentMethod === "vodafone" &&
      !/^01[0125][0-9]{8}$/.test(formData.senderWallet)
    )
      newErrors.senderWallet = "رقم المحفظة غير صحيح";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) {
      toast.error("يرجى إكمال جميع البيانات بشكل صحيح");
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder({
        sessionId: sessionId || undefined,
        customerName: formData.name,
        phone: formData.phone,
        governorate: formData.governorate,
        address: formData.address,
        paymentMethod: formData.paymentMethod,
        senderWallet:
          formData.paymentMethod === "vodafone"
            ? formData.senderWallet
            : undefined,
      });

      setOrderDetails(order as unknown as SummaryData);
      setIsSuccess(true);
      if (onSuccess) onSuccess();
      clearCart(); // Clear local and synced cart
      toast.success("تم تسجيل طلبك بنجاح!");
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء إتمام الطلب");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!orderDetails) return;

    setIsDownloading(true);
    // Give react time to render the hidden template
    setTimeout(async () => {
      if (!invoiceRef.current) {
        setIsDownloading(false);
        return;
      }

      try {
        const dataUrl = await toPng(invoiceRef.current, {
          quality: 0.95,
          backgroundColor: "#ffffff",
          cacheBust: true,
          pixelRatio: 2, // High-quality for senior level output
        });

        const link = document.createElement("a");
        link.download = `فاتورة-بيت-السعادة-${orderDetails._id.toString().slice(-6)}.png`;
        link.href = dataUrl;
        link.click();
        toast.success("تم تحميل الفاتورة بنجاح");
      } catch (error) {
        console.error("Capture error:", error);
        toast.error("حدث خطأ أثناء تحميل الفاتورة");
      } finally {
        setIsDownloading(false);
      }
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full h-14 rounded-2xl text-base font-bold gap-2 group">
            إتمام عملية الشراء
            <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:!max-w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-[32px] p-6 sm:p-8 rtl print:p-0 print:m-0 print:rounded-none">
        {isSuccess ? (
          <div className="py-4 sm:py-8 text-center print:text-right print:p-8 print:block">
            {/* Success UI for Screen */}
            <div className="print:hidden">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <DialogTitle className="text-2xl sm:text-3xl font-black mb-2">
                شكراً لطلبك!
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base font-medium text-muted-foreground mb-6 sm:mb-8">
                تم استلام طلبك بنجاح برقم:{" "}
                <span className="text-primary font-bold">
                  #{orderDetails?._id.slice(-6).toUpperCase()}
                </span>
              </DialogDescription>
            </div>

            {/* On-Screen Success Summary (Optimized for Mobile/Desktop View) */}
            <div className="bg-slate-50/50 rounded-3xl p-6 sm:p-8 mb-8 text-right space-y-6 border border-slate-100 print:hidden">
              <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-primary">
                    فاتورة شراء
                  </h2>
                  <p className="text-xs font-normal text-muted-foreground">
                    تاريخ الطلب:{" "}
                    {new Date(
                      orderDetails?.createdAt || Date.now(),
                    ).toLocaleDateString("ar-EG", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-xs font-black">
                    رقم الطلب: #{orderDetails?._id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <div className="w-12 h-12 relative rounded-xl overflow-hidden shadow-sm">
                  <NextImage
                    src="/logo.jpeg"
                    alt="Logo"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
                <div className="bg-white p-5 rounded-2xl space-y-1 border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">
                    المستلم
                  </p>
                  <p className="font-black text-slate-900">
                    {orderDetails?.customerName}
                  </p>
                  <p className="text-slate-500 font-bold">
                    {orderDetails?.phone}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-2xl space-y-1 border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">
                    العنوان
                  </p>
                  <p className="font-black text-slate-800">
                    {orderDetails?.governorate}
                  </p>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {orderDetails?.address}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-[32px] text-white flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-xs font-bold opacity-60">
                    الإجمالي الكلي
                  </span>
                  <span className="text-3xl font-black text-primary">
                    {orderDetails?.totalAmount} ج.م
                  </span>
                </div>
                <div className="flex flex-col items-end opacity-60">
                  <span className="text-[10px] font-black uppercase">
                    طريقة الدفع
                  </span>
                  <span className="text-xs font-bold">
                    {orderDetails?.paymentMethod === "cod"
                      ? "عند الاستلام"
                      : "فودافون كاش"}
                  </span>
                </div>
              </div>

              {orderDetails?.paymentMethod === "vodafone" && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 text-sm font-medium space-y-2">
                  <p className="font-bold">
                    يرجى تحويل المبلغ إلى الرقم التالي لتأكيد الطلب:
                  </p>
                  <p className="text-xl font-black text-center tracking-widest">
                    01017986283
                  </p>
                  <p className="text-xs">
                    سيتم مراجعة الطلب وتغيير حالته فور التأكد من التحويل.
                  </p>
                </div>
              )}
            </div>

            {/* Hidden High-Quality Premium Capture Template (Matches MyOrders exactly) */}
            {isDownloading && (
              <div
                className="fixed top-[-9999px] left-0 pointer-events-none opacity-0"
                aria-hidden="true"
              >
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
                          {orderDetails?._id.toString().slice(-8).toUpperCase()}
                        </span>
                      </p>
                      <div className="bg-muted p-3 rounded-2xl inline-block">
                        <p className="text-base font-black text-primary/80">
                          {orderDetails &&
                            new Intl.DateTimeFormat("ar-EG", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }).format(new Date(orderDetails.createdAt))}
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
                        {orderDetails?.customerName}
                      </p>
                      <p className="text-lg font-bold text-slate-600">
                        {orderDetails?.phone}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-[32px] space-y-4 border border-slate-100">
                      <h3 className="text-sm font-black text-primary/50 uppercase tracking-widest">
                        عنوان التوصيل
                      </h3>
                      <p className="text-xl font-bold text-slate-800">
                        {orderDetails?.governorate}
                      </p>
                      <p className="text-lg font-medium text-slate-600 leading-relaxed">
                        {orderDetails?.address}
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
                        {orderDetails?.items.map((item, i) => (
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
                        ))}
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
                      {orderDetails?.paymentMethod === "vodafone" && (
                        <div className="p-4 bg-amber-50 text-amber-800 rounded-3xl border border-amber-100 space-y-2">
                          <p className="font-bold text-sm">
                            دفع فودافون كاش (بانتظار التأكيد):
                          </p>
                          <p className="text-xs font-medium">
                            تم تسجيل الحساب المرسل منه:{" "}
                            {orderDetails.senderWallet}
                          </p>
                          <p className="text-xs font-medium">
                            يرجى التحويل للرقم: 01017986283
                          </p>
                        </div>
                      )}
                      <p className="text-slate-400 text-sm font-bold mr-2 italic">
                        شكراً لاختياركم بيت السعادة - Bait Els3ada
                      </p>
                    </div>

                    <div className="w-[320px] bg-slate-50 p-8 rounded-[40px] text-slate-900 space-y-4">
                      <div className="flex justify-between items-center pb-4 border-b border-slate-100 opacity-70">
                        <span className="font-bold text-lg">الشحن</span>
                        <span className="font-black text-xl">50 ج.م</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-black">الإجمالي</span>
                        <span className="text-4xl font-black text-primary">
                          {orderDetails?.totalAmount}{" "}
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
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 print:hidden">
              <Button
                variant="outline"
                className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold gap-2 bg-muted hover:bg-muted/80 disabled:opacity-50"
                onClick={handleDownloadInvoice}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                تحميل الفاتورة
              </Button>
              <Button
                className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold"
                onClick={() => {
                  setOpen(false);
                  router.push("/products");
                }}
              >
                العودة للمتجر
              </Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="text-right mb-6">
              <DialogTitle className="sm:text-2xl font-black">
                بيانات الشحن والتوصيل
              </DialogTitle>
              <DialogDescription className="text-muted-foreground font-medium">
                يرجى إدخال بياناتك بشكل صحيح لضمان وصول الطلب في أسرع وقت.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Info */}
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold mr-1">
                    الاسم بالكامل
                  </Label>
                  <Input
                    id="name"
                    placeholder="أحمد محمد محمود"
                    className={`h-12 rounded-xl border-border/50 focus:border-primary/50 ${errors.name ? "border-destructive focus:border-destructive" : ""}`}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                  />
                  {errors.name && (
                    <p className="text-xs font-bold text-destructive mr-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold mr-1">
                    رقم الهاتف
                  </Label>
                  <Input
                    id="phone"
                    placeholder="01xxxxxxxxx"
                    className={`h-12 rounded-xl border-border/50 focus:border-primary/50 text-left ${errors.phone ? "border-destructive focus:border-destructive" : ""}`}
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errors.phone) setErrors({ ...errors, phone: "" });
                    }}
                  />
                  {errors.phone && (
                    <p className="text-xs font-bold text-destructive mr-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold mr-1">المحافظة</Label>
                    <Select
                      value={formData.governorate}
                      onValueChange={(val) => {
                        setFormData({ ...formData, governorate: val });
                        if (errors.governorate)
                          setErrors({ ...errors, governorate: "" });
                      }}
                    >
                      <SelectTrigger
                        className={`h-12 rounded-xl border-border/50 ${errors.governorate ? "border-destructive focus:border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="اختر المحافظة" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {GOVERNORATES.map((gov) => (
                          <SelectItem key={gov} value={gov}>
                            {gov}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.governorate && (
                      <p className="text-xs font-bold text-destructive mr-1">
                        {errors.governorate}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-bold mr-1">
                      العنوان بالتفصيل
                    </Label>
                    <Input
                      id="address"
                      placeholder="رقم الشقة، الدور، الشارع"
                      className={`h-12 rounded-xl border-border/50 focus:border-primary/50 ${errors.address ? "border-destructive focus:border-destructive" : ""}`}
                      value={formData.address}
                      onChange={(e) => {
                        setFormData({ ...formData, address: e.target.value });
                        if (errors.address)
                          setErrors({ ...errors, address: "" });
                      }}
                    />
                    {errors.address && (
                      <p className="text-xs font-bold text-destructive mr-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Methods (UI Only) */}
              <div className="space-y-3 pt-2">
                <Label className="text-sm font-bold mr-1">طريقة الدفع</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      formData.paymentMethod === "cod"
                        ? "border-primary bg-primary/5 text-primary"
                        : errors.paymentMethod
                          ? "border-destructive"
                          : "border-border/50 hover:border-border"
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, paymentMethod: "cod" });
                      if (errors.paymentMethod)
                        setErrors({ ...errors, paymentMethod: "" });
                    }}
                  >
                    <Truck className="w-6 h-6" />
                    <span className="text-xs font-bold whitespace-nowrap">
                      الدفع عند الاستلام
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      formData.paymentMethod === "vodafone"
                        ? "border-primary bg-primary/5 text-primary"
                        : errors.paymentMethod
                          ? "border-destructive"
                          : "border-border/50 hover:border-border"
                    }`}
                    onClick={() => {
                      setFormData({ ...formData, paymentMethod: "vodafone" });
                      if (errors.paymentMethod)
                        setErrors({ ...errors, paymentMethod: "" });
                    }}
                  >
                    <Smartphone className="w-6 h-6" />
                    <span className="text-xs font-bold">فودافون كاش</span>
                  </button>
                </div>
                {errors.paymentMethod && (
                  <p className="text-xs font-bold text-destructive mr-1">
                    {errors.paymentMethod}
                  </p>
                )}

                {formData.paymentMethod === "vodafone" && (
                  <div className="mt-4 p-5 bg-primary/5 border border-primary/20 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold">تعليمات الدفع:</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            قم بتحويل المبلغ الإجمالي للفاتورة إلى الرقم التالي
                            عبر محفظة فودافون كاش:
                          </p>
                          <p className="text-lg font-black text-primary tracking-widest pt-1">
                            01017986283
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="senderWallet"
                          className="text-xs font-bold mr-1"
                        >
                          رقم المحفظة الذي ستحول منه
                        </Label>
                        <Input
                          id="senderWallet"
                          placeholder="01xxxxxxxxx"
                          className={`h-11 rounded-xl border-border/50 focus:border-primary/50 text-left ${errors.senderWallet ? "border-destructive focus:border-destructive" : ""}`}
                          dir="ltr"
                          value={formData.senderWallet}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              senderWallet: e.target.value,
                            });
                            if (errors.senderWallet)
                              setErrors({ ...errors, senderWallet: "" });
                          }}
                        />
                        {errors.senderWallet && (
                          <p className="text-[10px] font-bold text-destructive mr-1">
                            {errors.senderWallet}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Mini */}
              <div className="p-5 bg-muted/30 rounded-2xl space-y-2 border border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    إجمالي المنتجات
                  </span>
                  <span className="font-bold">{subtotal} ج.م</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">
                    تكلفة الشحن
                  </span>
                  <span className="font-bold">{shipping} ج.م</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-border/20">
                  <span className="font-black text-foreground">
                    الإجمالي الكلي
                  </span>
                  <span className="font-black text-primary">{total} ج.م</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl text-base font-bold"
                disabled={loading}
              >
                {loading ? "جاري تنفيذ طلبك..." : "تأكيد الطلب"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
