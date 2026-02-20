"use client";

import Image from "next/image";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import {
  AddCategoryModal,
  type CategoryFormData,
} from "@/components/dashboard/categories/add-category-modal";
import { Plus, LayoutGrid, Pencil, Trash2, Package, Grid } from "lucide-react";
import { DeleteCategoryModal } from "@/components/dashboard/categories/delete-category-modal";
import { CategoriesEmptyState } from "@/components/dashboard/categories/categories-empty-state";

export interface Category {
  id: string;
  name: string;
  image: string;
  productsCount: number;
  dateAdded: string;
}

// ── Mock Data ──
const mockCategories: Category[] = [
  {
    id: "1",
    name: "ساعات",
    image: "/ring.png",
    productsCount: 12,
    dateAdded: "2025-08-15",
  },
  {
    id: "2",
    name: "هدايا",
    image: "/giftbox.png",
    productsCount: 8,
    dateAdded: "2025-09-02",
  },
  {
    id: "3",
    name: "مكياج",
    image: "/cosmetic-accessories.png",
    productsCount: 15,
    dateAdded: "2025-09-20",
  },
  {
    id: "4",
    name: "إكسسوارات",
    image: "/ring.png",
    productsCount: 20,
    dateAdded: "2025-10-05",
  },
  {
    id: "5",
    name: "عناية بالبشرة",
    image: "/handcraft.png",
    productsCount: 10,
    dateAdded: "2025-10-18",
  },
  {
    id: "6",
    name: "عطور",
    image: "/print.png",
    productsCount: 7,
    dateAdded: "2025-11-01",
  },
  {
    id: "7",
    name: "شنط",
    image: "/handcraft.png",
    productsCount: 6,
    dateAdded: "2025-11-15",
  },
  {
    id: "8",
    name: "شموع عطرية",
    image: "/giftbox.png",
    productsCount: 4,
    dateAdded: "2025-12-01",
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] =
    React.useState<Category[]>(mockCategories);

  // Search
  const [search, setSearch] = React.useState("");

  // Modals
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editCategory, setEditCategory] = React.useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = React.useState<Category | null>(
    null,
  );

  // ── Filter ──
  const filteredCategories = React.useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.trim().toLowerCase();
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, search]);

  // ── Handlers ──
  const handleAddCategory = (data: CategoryFormData) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: data.name,
      image: data.image || "/giftbox.png",
      productsCount: 0,
      dateAdded: new Date().toISOString().split("T")[0],
    };
    setCategories((prev) => [newCategory, ...prev]);
  };

  const handleEditCategory = (data: CategoryFormData) => {
    if (!editCategory) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.id === editCategory.id
          ? { ...c, name: data.name, image: data.image || c.image }
          : c,
      ),
    );
    setEditCategory(null);
  };

  const handleDeleteCategory = () => {
    if (!deleteCategory) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteCategory.id));
    setDeleteCategory(null);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            إدارة الفئات
          </h2>
          <p className="text-muted-foreground font-medium">
            أضيفي وعدّلي فئات المنتجات لتنظيم متجرك.
          </p>
        </div>
        <Button
          onClick={() => setAddModalOpen(true)}
          className="w-full sm:w-auto rounded-xl font-bold gap-2 px-6 h-11 self-start"
        >
          <Plus className="size-4" />
          إضافة فئة جديدة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-blue-100/50 text-blue-600 shrink-0">
              <LayoutGrid className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide">
                إجمالي الفئات
              </h3>
              <div className="flex items-end gap-2 my-1">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {categories.length}
                </p>
                <p className="text-[11px] font-bold text-muted-foreground/60">
                  فئة مسجلة
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-emerald-100/50 text-emerald-600 shrink-0">
              <Package className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide">
                إجمالي المنتجات
              </h3>
              <div className="flex items-end gap-2 my-1">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {categories.reduce((sum, c) => sum + c.productsCount, 0)}
                </p>
                <p className="text-[11px] font-bold text-emerald-600/60">
                  منتج في جميع الفئات
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20 sm:col-span-2 xl:col-span-1">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-violet-100/50 text-violet-600 shrink-0">
              <Grid className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide">
                متوسط المنتجات
              </h3>
              <div className="flex items-end gap-2 my-1">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {categories.length > 0
                    ? Math.round(
                        categories.reduce(
                          (sum, c) => sum + c.productsCount,
                          0,
                        ) / categories.length,
                      )
                    : 0}
                </p>
                <p className="text-[11px] font-bold text-violet-600/60">
                  منتج لكل فئة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border bg-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن فئة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 rounded-xl h-10 font-medium"
            />
          </div>
          {search && (
            <Button
              variant="default"
              onClick={() => setSearch("")}
              className="w-full sm:w-auto rounded-xl h-10 gap-1.5 animate-in fade-in zoom-in duration-300"
            >
              <RotateCcw className="size-3.5" />
              إعادة تعيين
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground font-medium px-1">
        عرض{" "}
        <span className="font-bold text-foreground">
          {filteredCategories.length}
        </span>{" "}
        فئة
      </p>

      {/* Categories Grid or Empty State */}
      {filteredCategories.length === 0 ? (
        <CategoriesEmptyState onAddCategory={() => setAddModalOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="group rounded-2xl border bg-card overflow-hidden transition-all duration-300 hover:border-primary/20"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] bg-muted/30 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay on hover — desktop only */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 hidden md:block" />

                {/* Actions overlay — desktop only (hover) */}
                <div className="absolute top-2 left-2 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex">
                  <button
                    onClick={() => setEditCategory(category)}
                    className="p-2 rounded-xl bg-white/90 text-foreground hover:bg-white transition-colors"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteCategory(category)}
                    className="p-2 rounded-xl bg-white/90 text-destructive hover:bg-white transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                {/* Products count badge */}
                <div className="absolute bottom-2 right-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 text-xs font-bold text-foreground backdrop-blur-sm">
                    <Package className="size-3" />
                    {category.productsCount} منتج
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-base">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium mt-1">
                      أُضيف في {category.dateAdded}
                    </p>
                  </div>

                  {/* Mobile action buttons — always visible */}
                  <div className="flex items-center gap-1.5 md:hidden">
                    <button
                      onClick={() => setEditCategory(category)}
                      className="p-2 rounded-xl border text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => setDeleteCategory(category)}
                      className="p-2 rounded-xl border text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Category Modal */}
      <AddCategoryModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSave={handleAddCategory}
      />

      {/* Edit Category Modal */}
      <AddCategoryModal
        open={!!editCategory}
        onOpenChange={(open) => !open && setEditCategory(null)}
        editData={
          editCategory
            ? { name: editCategory.name, image: editCategory.image }
            : null
        }
        onSave={handleEditCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteCategoryModal
        open={!!deleteCategory}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
        categoryName={deleteCategory?.name || ""}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
}
