import { Button } from "@/components/ui/button";
import { LayoutGrid, RotateCcw, Plus } from "lucide-react";

interface CategoriesEmptyStateProps {
  onAddCategory: () => void;
  isFiltering?: boolean;
  onReset?: () => void;
}

export function CategoriesEmptyState({
  onAddCategory,
  isFiltering,
  onReset,
}: CategoriesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
          <LayoutGrid className="size-12 text-primary/60" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        {isFiltering ? "لا توجد نتائج تطابق بحثك" : "لا توجد فئات حالياً"}
      </h3>
      <p className="text-muted-foreground max-w-sm font-medium text-sm mb-6">
        {isFiltering
          ? "جرب استخدام كلمات بحث مختلفة أو قم بإعادة تعيين الفلاتر للعثور على ما تبحث عنه."
          : "لم يتم العثور على أي فئات. أضيفي فئات جديدة لتنظيم المنتجات."}
      </p>

      {isFiltering ? (
        <Button onClick={onReset} className="rounded-xl gap-2 px-6 h-11">
          <RotateCcw className="size-4" />
          إعادة تعيين البحث
        </Button>
      ) : (
        <Button onClick={onAddCategory} className="rounded-xl gap-2 px-6 h-11">
          <Plus className="size-4" />
          إضافة فئة جديدة
        </Button>
      )}
    </div>
  );
}
