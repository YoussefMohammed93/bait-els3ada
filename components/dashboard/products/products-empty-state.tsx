"use client";

import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductsEmptyStateProps {
  onAddProduct: () => void;
}

export function ProductsEmptyState({ onAddProduct }: ProductsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Package className="size-12 text-primary/60" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        لا توجد منتجات حالياً
      </h3>
      <p className="text-sm text-muted-foreground font-medium mb-6 text-center max-w-sm">
        لم يتم إضافة أي منتجات بعد. ابدأ بإضافة منتجك الأول لعرضه في المتجر.
      </p>
      <Button
        onClick={onAddProduct}
        className="rounded-xl font-bold gap-2 px-6 h-11"
      >
        <Plus className="size-4" />
        إضافة منتج جديد
      </Button>
    </div>
  );
}
