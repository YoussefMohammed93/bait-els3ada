import { Button } from "@/components/ui/button";
import { Package, Plus, Search, RotateCcw } from "lucide-react";

interface ProductsEmptyStateProps {
  onAddProduct: () => void;
  isFiltering?: boolean;
  onReset?: () => void;
}

export function ProductsEmptyState({
  onAddProduct,
  isFiltering,
  onReset,
}: ProductsEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
          {isFiltering ? (
            <Search className="size-12 text-primary/60" />
          ) : (
            <Package className="size-12 text-primary/60" />
          )}
        </div>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        {isFiltering ? "لا توجد منتجات تطابق بحثك" : "لا توجد منتجات حالياً"}
      </h3>
      <p className="text-sm text-muted-foreground font-medium mb-6 text-center max-w-sm">
        {isFiltering
          ? "جرب استخدام كلمات بحث مختلفة أو تغيير خيارات التصفية للعثور على ما تبحث عنه."
          : "لم يتم إضافة أي منتجات بعد. ابدأ بإضافة منتجك الأول لعرضه في المتجر."}
      </p>

      {isFiltering ? (
        <Button onClick={onReset} className="rounded-xl gap-2 px-6 h-11">
          <RotateCcw className="size-4" />
          إعادة تعيين الفلاتر
        </Button>
      ) : (
        <Button onClick={onAddProduct} className="rounded-xl gap-2 px-6 h-11">
          <Plus className="size-4" />
          إضافة منتج جديد
        </Button>
      )}
    </div>
  );
}
