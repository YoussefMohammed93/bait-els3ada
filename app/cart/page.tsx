"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "convex/react";
import { useCart } from "@/hooks/use-cart";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const { sessionId, updateQuantity, removeItem, clearCart } = useCart();

  const cartData = useQuery(api.cart.get, { sessionId: sessionId || "" });

  const subtotal = useMemo(() => {
    if (!cartData) return 0;
    return cartData.items.reduce((acc, item) => {
      return acc + (item.product?.price || 0) * item.quantity;
    }, 0);
  }, [cartData]);

  const shipping = 50; // Fixed shipping
  const total = subtotal + shipping;

  if (cartData === undefined) {
    return (
      <div className="flex-1 py-12">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-5">
          <Skeleton className="h-10 w-48 mb-8 rounded-xl" />
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
              ))}
            </div>
            <div className="w-full lg:w-[380px]">
              <Skeleton className="h-[400px] w-full rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cartData.items || cartData.items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-black text-foreground mb-3">
          سلة التسوق فارغة
        </h1>
        <p className="text-muted-foreground font-medium mb-8 text-center max-w-md">
          يبدو أنك لم تضف أي منتجات إلى سلتك بعد. تصفح منتجاتنا المميزة وابدأ
          التسوق الآن!
        </p>
        <Button
          asChild
          className="rounded-2xl h-14 px-8 text-base font-bold gap-2"
        >
          <Link href="/products">
            <ArrowRight className="w-5 h-5 rotate-180" />
            ابدأ التسوق
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 py-8 sm:py-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">
            سلة <span className="text-primary">التسوق</span>
          </h1>
          <Button
            variant="ghost"
            onClick={clearCart}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl gap-2 font-bold"
          >
            <Trash2 className="w-4 h-4" />
            مسح الكل
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="flex-1 space-y-4 sm:space-y-6">
            {cartData.items.map((item) => (
              <div
                key={item.productId}
                className="group relative flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-5 bg-white border border-border/50 rounded-[28px] transition-all hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20"
              >
                {/* Product Image */}
                <Link
                  href={`/products/${item.productId}`}
                  className="relative aspect-square w-full sm:w-32 h-32 rounded-2xl overflow-hidden shrink-0 bg-muted/30"
                >
                  <Image
                    src={item.product?.image || "/placeholder-product.jpg"}
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <Link
                      href={`/products/${item.productId}`}
                      className="group/title"
                    >
                      <h3 className="font-black text-lg text-foreground group-hover/title:text-primary transition-colors line-clamp-1">
                        {item.product?.name}
                      </h3>
                      <p className="text-xs font-bold text-primary/60 uppercase tracking-wider mt-0.5">
                        {item.product?.category}
                      </p>
                    </Link>
                    <div className="text-left shrink-0">
                      <p className="font-black text-xl text-primary">
                        {(item.product?.price || 0) * item.quantity} ج.م
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground font-medium mt-2">
                          {item.product?.price} ج.م للقطعة
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-muted/50 rounded-xl p-1 border border-border/40">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId as Id<"products">,
                            item.quantity - 1,
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white transition-all text-muted-foreground disabled:opacity-30 disabled:hover:bg-transparent"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-black text-base">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.productId as Id<"products">,
                            item.quantity + 1,
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white transition-all text-muted-foreground"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Action */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeItem(item.productId as Id<"products">)
                      }
                      className="w-10 h-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="w-full lg:w-[380px]">
            <div className="sticky top-24 bg-white border border-border/50 rounded-[32px] p-6 sm:p-8 flex flex-col shadow-2xl shadow-primary/5">
              <h2 className="text-2xl font-black text-foreground mb-6">
                ملخص الفاتورة
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">
                    إجمالي المنتجات
                  </span>
                  <span className="font-bold text-foreground">
                    {subtotal} ج.م
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">
                    تكلفة الشحن
                  </span>
                  <span className="font-bold text-foreground">50 ج.م</span>
                </div>
                <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                  <span className="text-lg font-black text-foreground">
                    الإجمالي الكلي
                  </span>
                  <span className="text-3xl font-black text-primary leading-none">
                    {total}{" "}
                    <span className="text-sm font-bold opacity-70">ج.م</span>
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full h-14 rounded-2xl text-base font-bold gap-2 group">
                  إتمام عملية الشراء
                  <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="w-full h-12 rounded-2xl text-sm font-bold border-border/50 hover:bg-muted"
                >
                  <Link href="/products">متابعة التسوق</Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-col items-center gap-4 text-center">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    تشفير آمن للبيانات 100%
                  </span>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <Image
                    src="https://img.icons8.com/?size=100&id=KBKRxZpgSQEA&format=png&color=000000"
                    width={32}
                    height={32}
                    alt="Vodafone Cash"
                  />
                  <Image
                    src="https://img.icons8.com/color/48/mastercard.png"
                    width={32}
                    height={32}
                    alt="Mastercard"
                  />
                  <Image
                    src="https://img.icons8.com/?size=100&id=sEKgR1y9wCDU&format=png&color=000000"
                    width={32}
                    height={32}
                    alt="COD"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
