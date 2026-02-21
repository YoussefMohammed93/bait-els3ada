import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, RotateCcw } from "lucide-react";

interface OrdersEmptyStateProps {
  isFiltering?: boolean;
  onReset?: () => void;
}

export function OrdersEmptyState({
  isFiltering,
  onReset,
}: OrdersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
          {isFiltering ? (
            <Search className="size-12 text-primary/60" />
          ) : (
            <ShoppingCart className="size-12 text-primary/60" />
          )}
        </div>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        {isFiltering ? "لا توجد طلبات تطابق بحثك" : "لا توجد طلبات حالياً"}
      </h3>
      <p className="text-muted-foreground max-w-sm font-medium text-sm mb-6">
        {isFiltering
          ? "جرب استخدام كلمات بحث مختلفة أو تغيير خيارات التصفية للعثور على الطلبات."
          : "لم يتم استلام أي طلبات بعد. ستظهر الطلبات هنا بمجرد قيام العملاء بالشراء من متجرك."}
      </p>

      {isFiltering && (
        <Button onClick={onReset} className="rounded-xl gap-2 px-6 h-11">
          <RotateCcw className="size-4" />
          إعادة تعيين الفلاتر
        </Button>
      )}
    </div>
  );
}
