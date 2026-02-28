"use client";

import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WhatsAppOrderButton } from "@/components/whatsapp-order-button";

interface FavoritesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FavoritesDialog({ open, onOpenChange }: FavoritesDialogProps) {
  const { favoriteProducts, isLoading, toggleItem } = useWishlist();

  const handleRemove = async (productId: Id<"products">) => {
    await toggleItem(productId);
    toast.info("تم إزالة المنتج من المفضلة");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] sm:!max-w-[600px] p-0 overflow-hidden bg-white rounded-[32px] sm:rounded-[40px] border-none shadow-2xl"
        dir="rtl"
      >
        <DialogHeader className="p-5 sm:p-6 border-b bg-muted/5">
          <DialogTitle className="text-lg sm:text-xl font-black flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary">
              <Heart className="w-5 h-5 fill-primary" />
            </div>
            قائمة المفضلة
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh]">
          <div className="!p-5 space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex flex-row gap-5 p-4 rounded-[24px] border border-border/30 bg-white"
                  >
                    <div className="size-20 sm:size-24 rounded-2xl bg-muted animate-pulse shrink-0 order-first" />
                    <div className="flex-1 space-y-3 py-1">
                      <Skeleton className="h-5 w-3/4 rounded-lg" />
                      <Skeleton className="h-4 w-full rounded-lg" />
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-9 w-24 rounded-full" />
                        <Skeleton className="h-9 w-9 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : favoriteProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-[32px] bg-primary/5 flex items-center justify-center mb-6 border border-primary/10">
                  <Heart className="w-10 h-10 text-primary/30" />
                </div>
                <h3 className="text-xl font-black mb-2">قائمة المفضلة فارغة</h3>
                <p className="text-muted-foreground font-medium text-sm max-w-[280px] leading-relaxed">
                  ابدأ بإضافة المنتجات التي تعجبك لتجدها هنا لاحقاً بكل سهولة.
                </p>
                <Button
                  className="mt-6 rounded-xl px-8 h-11 font-black text-sm bg-primary hover:bg-primary/90"
                  onClick={() => onOpenChange(false)}
                >
                  تصفح المنتجات
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              favoriteProducts.map((product) => (
                <div
                  key={product._id}
                  className="group bg-white transition-all duration-300 relative overflow-hidden border-b pb-5 last:border-none last:pb-0"
                >
                  <div className="flex flex-row gap-4 sm:gap-6 items-start">
                    {/* Image on the RIGHT (first in RTL DOM) */}
                    <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-[20px] sm:rounded-[24px] overflow-hidden bg-slate-50 border border-border/20 shrink-0">
                      <Image
                        src={product.image || "/placeholder-product.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 80px, 112px"
                      />
                    </div>

                    {/* Content on the LEFT */}
                    <div className="flex-1 min-w-0 flex flex-col gap-2 text-right">
                      <div>
                        <h3 className="font-black text-foreground text-base sm:text-lg truncate group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground font-medium text-xs sm:text-sm line-clamp-1 mt-0.5">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-baseline justify-end gap-1.5">
                        <span className="text-lg sm:text-xl font-black text-primary">
                          {product.price}
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-primary/60">
                          ج.م
                        </span>
                      </div>

                      <div className="flex flex-row-reverse items-center justify-start gap-3 sm:gap-5 mt-1">
                        <WhatsAppOrderButton
                          productName={product.name}
                          productPrice={product.price}
                          productUrl={`${typeof window !== "undefined" ? window.location.origin : ""}/products/${product._id}`}
                          size="sm"
                          label="اطلب الان"
                          className="h-9 sm:h-11 px-5 sm:px-8"
                        />

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemove(product._id)}
                          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-50/50"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
