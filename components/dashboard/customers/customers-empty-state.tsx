import { Button } from "@/components/ui/button";
import { Users, Search, RotateCcw } from "lucide-react";

interface CustomersEmptyStateProps {
  isFiltering?: boolean;
  onReset?: () => void;
}

export function CustomersEmptyState({
  isFiltering,
  onReset,
}: CustomersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
          {isFiltering ? (
            <Search className="size-12 text-primary/60" />
          ) : (
            <Users className="size-12 text-primary/60" />
          )}
        </div>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        {isFiltering ? "لا يوجد عملاء يطابقون بحثك" : "لا يوجد عملاء حالياً"}
      </h3>
      <p className="text-muted-foreground max-w-sm font-medium text-sm mb-6">
        {isFiltering
          ? "جرب البحث بالاسم أو رقم الهاتف أو تغيير فلاتر الحالة للعثور على العميل."
          : "لم ينضم أي عملاء بعد. سجل العملاء سيظهر هنا بمجرد قيام أول زائر بالطلب من متجرك."}
      </p>

      {isFiltering && (
        <Button onClick={onReset} className="rounded-xl gap-2 px-6 h-11">
          <RotateCcw className="size-4" />
          إعادة تعيين البحث
        </Button>
      )}
    </div>
  );
}
