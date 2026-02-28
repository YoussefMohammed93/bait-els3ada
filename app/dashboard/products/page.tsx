"use client";

import {
  Plus,
  Package,
  XCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import * as React from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import {
  ProductsTable,
  type Product,
} from "@/components/dashboard/products/products-table";
import {
  AddProductModal,
  type ProductFormData,
} from "@/components/dashboard/products/add-product-modal";
import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { ProductsFilters } from "@/components/dashboard/products/products-filters";
import { DeleteConfirmModal } from "@/components/dashboard/products/delete-confirm-modal";
import { ProductsEmptyState } from "@/components/dashboard/products/products-empty-state";

const ITEMS_PER_PAGE = 6;

export default function ProductsPage() {
  // Filters
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [stockStatus, setStockStatus] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Pagination & Data Fetching
  const { results, status, loadMore } = usePaginatedQuery(
    api.products.list,
    {
      search: search || undefined,
      category: category || undefined,
      status: stockStatus || undefined,
      sortBy: sortBy || undefined,
    },
    { initialNumItems: ITEMS_PER_PAGE * currentPage },
  );

  const products = (results || []).map((p) => {
    const { _id, _creationTime, ...rest } = p;
    const pWithDate = p as { dateAdded?: string };
    return {
      ...rest,
      id: _id,
      dateAdded:
        pWithDate.dateAdded ||
        new Date(_creationTime).toISOString().split("T")[0],
    };
  }) as Product[];

  const isLoading = status === "LoadingFirstPage";
  const isLoadingMore = status === "LoadingMore";

  // Categories for Filter
  const categoriesListing = (useQuery(api.categories.list) || []).map((c) => ({
    value: c.name,
    label: c.name,
  }));

  // Mutations
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);

  // Modals
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = React.useState<Product | null>(
    null,
  );

  const [isActionLoading, setIsActionLoading] = React.useState(false);

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, category, stockStatus, sortBy]);

  // Pagination calculation
  // Since Convex's usePaginatedQuery is more about "load more", but the UI has page numbers,
  // we'll simulate page numbers based on the ITEMS_PER_PAGE.
  // Note: For a true "server-side skip" pagination, Convex needs a different approach or manual offset management.
  // For now, we'll use ITEMS_PER_PAGE to slice.
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ── Handlers ──
  const handleAddProduct = async (data: ProductFormData) => {
    setIsActionLoading(true);
    try {
      await createProduct({
        name: data.name,
        description: data.description,
        category: data.category,
        price: parseFloat(data.price) || 0,
        stock: parseInt(data.stock) || 0,
        status:
          parseInt(data.stock) === 0
            ? "غير متوفر"
            : parseInt(data.stock) <= 5
              ? "كمية قليلة"
              : "متوفر",
        image: data.image || "/placeholder-product.jpg",
        images: data.images?.length ? data.images : undefined,
        dateAdded: new Date().toISOString().split("T")[0],
      });
      toast.success("تم إضافة المنتج بنجاح");
      setAddModalOpen(false);
    } catch {
      toast.error("حدث خطأ أثناء إضافة المنتج");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleEditProduct = async (data: ProductFormData) => {
    if (!editProduct) return;
    setIsActionLoading(true);
    try {
      await updateProduct({
        id: editProduct.id as Id<"products">,
        name: data.name,
        description: data.description,
        category: data.category,
        price: parseFloat(data.price) || 0,
        stock: parseInt(data.stock) || 0,
        status:
          parseInt(data.stock) === 0
            ? "غير متوفر"
            : parseInt(data.stock) <= 5
              ? "كمية قليلة"
              : "متوفر",
        image: data.image || editProduct.image,
        images: data.images?.length ? data.images : editProduct.images,
        dateAdded: editProduct.dateAdded,
      });
      toast.success("تم تحديث المنتج بنجاح");
      setEditProduct(null);
    } catch {
      toast.error("حدث خطأ أثناء تحديث المنتج");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProduct) return;
    setIsActionLoading(true);
    try {
      await removeProduct({ id: deleteProduct.id as Id<"products"> });
      toast.success("تم حذف المنتج بنجاح");
      setDeleteProduct(null);
    } catch {
      toast.error("حدث خطأ أثناء حذف المنتج");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("all");
    setStockStatus("all");
    setSortBy("newest");
  };

  const handlePageChange = (page: number) => {
    if (page > currentPage && status === "CanLoadMore") {
      loadMore(ITEMS_PER_PAGE);
    }
    setCurrentPage(page);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            إدارة المنتجات
          </h2>
          <p className="text-muted-foreground font-medium">
            يمكنك من هنا إضافة وتعديل وإدارة جميع المنتجات في متجرك.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => setAddModalOpen(true)}
            className="w-full sm:w-auto rounded-xl font-bold gap-2 px-6 h-11 self-start"
          >
            <Plus className="size-4" />
            إضافة منتج جديد
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Products */}
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-blue-100/50 text-blue-600 shrink-0">
              <Package className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide truncate">
                إجمالي المنتجات
              </h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {products.length}
                </p>
                <p className="text-xs font-bold text-muted-foreground/60">
                  منتج مسجل
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Products */}
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-emerald-100/50 text-emerald-600 shrink-0">
              <CheckCircle2 className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide truncate">
                المنتجات المتوفرة
              </h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {products.filter((p) => p.status === "متوفر").length}
                </p>
                <p className="text-xs font-bold text-emerald-600/80">
                  جاهزة للبيع
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Low Stock Products */}
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-orange-100/50 text-orange-600 shrink-0">
              <AlertTriangle className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide truncate">
                أوشكت على النفاذ
              </h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {products.filter((p) => p.status === "كمية قليلة").length}
                </p>
                <p className="text-xs font-bold text-orange-600/80">
                  كمية محدودة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Out of Stock Products */}
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-destructive/10 text-destructive shrink-0">
              <XCircle className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide truncate">
                منتجات نفدت
              </h3>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {products.filter((p) => p.status === "غير متوفر").length}
                </p>
                <p className="text-xs font-bold text-destructive">
                  غير متاح حالياً
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ProductsFilters
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        stockStatus={stockStatus}
        onStockStatusChange={setStockStatus}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onReset={handleResetFilters}
        categories={categoriesListing}
      />

      {/* Results count */}
      <p className="text-sm text-muted-foreground font-medium flex items-center justify-between">
        <span>
          عرض{" "}
          <span className="text-foreground font-bold">{products.length}</span>{" "}
          منتج
          {search || category !== "all" || stockStatus !== "all"
            ? " ( النتائج المطابقة لخيارات التصفية )"
            : ""}
        </span>
        {(isLoading || isLoadingMore) && (
          <Loader className="size-4 animate-spin text-primary" />
        )}
      </p>

      {/* Table or Empty State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-dashed">
          <Loader className="size-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-medium">
            جاري تحميل المنتجات...
          </p>
        </div>
      ) : products.length === 0 ? (
        <ProductsEmptyState
          onAddProduct={() => setAddModalOpen(true)}
          isFiltering={!!search || category !== "all" || stockStatus !== "all"}
          onReset={handleResetFilters}
        />
      ) : (
        <ProductsTable
          products={paginatedProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onEdit={(product) => setEditProduct(product)}
          onDelete={(product) => setDeleteProduct(product)}
        />
      )}

      {/* Add Product Modal */}
      <AddProductModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSave={handleAddProduct}
        isLoading={isActionLoading}
        categories={categoriesListing}
      />

      {/* Edit Product Modal */}
      <AddProductModal
        open={!!editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
        isLoading={isActionLoading}
        categories={categoriesListing}
        editData={
          editProduct
            ? {
                name: editProduct.name,
                description: editProduct.description,
                price: editProduct.price.toString(),
                category: editProduct.category,
                stock: editProduct.stock.toString(),
                image: editProduct.image,
                images: editProduct.images ?? [],
              }
            : null
        }
        onSave={handleEditProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={!!deleteProduct}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
        productName={deleteProduct?.name || ""}
        onConfirm={handleDeleteProduct}
        isLoading={isActionLoading}
      />
    </div>
  );
}
