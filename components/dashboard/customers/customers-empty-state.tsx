"use client";

import { Users } from "lucide-react";

export function CustomersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Users className="size-12 text-primary/60" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        لا يوجد عملاء حالياً
      </h3>
      <p className="text-muted-foreground max-w-sm font-medium text-sm">
        لم يتم العثور على أي عملاء يطابقون معايير البحث الحالية. جرّب تغيير
        خيارات التصفية.
      </p>
    </div>
  );
}
