"use client";

import { LayoutGrid } from "lucide-react";

export function CategoriesEmptyState({
  onAddCategory,
}: {
  onAddCategory: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center">
          <LayoutGrid className="size-12 text-primary/60" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        لا توجد فئات حالياً
      </h3>
      <p className="text-muted-foreground max-w-sm font-medium text-sm mb-4">
        لم يتم العثور على أي فئات. أضيفي فئات جديدة لتنظيم المنتجات.
      </p>
      <button
        onClick={onAddCategory}
        className="text-sm font-bold text-primary hover:underline"
      >
        إضافة فئة جديدة ←
      </button>
    </div>
  );
}
