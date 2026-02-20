"use client";

import {
  Plus,
  Package,
  XCircle,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  ProductsTable,
  type Product,
} from "@/components/dashboard/products/products-table";
import {
  AddProductModal,
  type ProductFormData,
} from "@/components/dashboard/products/add-product-modal";
import { ProductsFilters } from "@/components/dashboard/products/products-filters";
import { DeleteConfirmModal } from "@/components/dashboard/products/delete-confirm-modal";
import { ProductsEmptyState } from "@/components/dashboard/products/products-empty-state";

// ── Mock Data (inline — will be replaced with API calls) ──
const mockProducts: Product[] = [
  {
    id: "1",
    name: "مجموعة مكياج سهرة فاخرة",
    description:
      "مجموعة مكياج كاملة للسهرات تضم أحمر شفاه، كريم أساس، وظلال عيون",
    category: "مكياج",
    price: 1200,
    stock: 25,
    status: "متوفر",
    image: "/cosmetic-accessories.png",
    images: ["/print.png", "/handcraft.png"],
    dateAdded: "2026-02-15",
  },
  {
    id: "2",
    name: "كريم مرطب طبيعي",
    description: "كريم مرطب بالمكونات الطبيعية للعناية اليومية بالبشرة",
    category: "عناية بالبشرة",
    price: 350,
    stock: 4,
    status: "كمية قليلة",
    image: "/handcraft.png",
    images: ["/cosmetic-accessories.png"],
    dateAdded: "2026-02-12",
  },
  {
    id: "3",
    name: "عطر زهور الربيع",
    description: "عطر نسائي فاخر برائحة الزهور الطبيعية المنعشة",
    category: "عطور",
    price: 890,
    stock: 18,
    status: "متوفر",
    image: "/ring.png",
    dateAdded: "2026-02-10",
  },
  {
    id: "4",
    name: "سلسلة فضية مع قلب",
    description: "سلسلة فضية أنيقة بتصميم القلب مع حجر كريستال",
    category: "إكسسوارات",
    price: 450,
    stock: 0,
    status: "غير متوفر",
    image: "/ring.png",
    images: ["/giftbox.png", "/print.png"],
    dateAdded: "2026-02-08",
  },
  {
    id: "5",
    name: "شنطة مكياج جلدية",
    description: "شنطة مكياج من الجلد الطبيعي بتصميم عصري وعملي",
    category: "شنط",
    price: 680,
    stock: 12,
    status: "متوفر",
    image: "/handcraft.png",
    dateAdded: "2026-02-05",
  },
  {
    id: "6",
    name: "بوكس هدية عيد الحب",
    description: "بوكس هدية يحتوي على شموع عطرية وشوكولاتة فاخرة",
    category: "هدايا",
    price: 550,
    stock: 3,
    status: "كمية قليلة",
    image: "/giftbox.png",
    images: ["/cosmetic-accessories.png", "/ring.png", "/handcraft.png"],
    dateAdded: "2026-02-03",
  },
  {
    id: "7",
    name: "سيروم فيتامين سي",
    description: "سيروم فيتامين سي المركز لنضارة البشرة وتوحيد اللون",
    category: "عناية بالبشرة",
    price: 420,
    stock: 30,
    status: "متوفر",
    image: "/cosmetic-accessories.png",
    dateAdded: "2026-02-01",
  },
  {
    id: "8",
    name: "أحمر شفاه مطفي",
    description: "أحمر شفاه مطفي طويل الثبات بألوان متعددة",
    category: "مكياج",
    price: 180,
    stock: 50,
    status: "متوفر",
    image: "/print.png",
    dateAdded: "2026-01-28",
  },
  {
    id: "9",
    name: "أسوارة ذهبية مرصعة",
    description: "أسوارة ذهبية مرصعة بالزركون مع قفل مغناطيسي",
    category: "إكسسوارات",
    price: 750,
    stock: 0,
    status: "غير متوفر",
    image: "/ring.png",
    dateAdded: "2026-01-25",
  },
  {
    id: "10",
    name: "شنطة كروس صغيرة",
    description: "شنطة كروس أنيقة للخروجات اليومية بتصميم بسيط وعملي",
    category: "شنط",
    price: 320,
    stock: 8,
    status: "متوفر",
    image: "/handcraft.png",
    dateAdded: "2026-01-20",
  },
];

const ITEMS_PER_PAGE = 6;

export default function ProductsPage() {
  // Products data
  const [products, setProducts] = React.useState<Product[]>(mockProducts);

  // Filters
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [stockStatus, setStockStatus] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);

  // Modals
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = React.useState<Product | null>(
    null,
  );

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, category, stockStatus, sortBy]);

  // ── Filter & Sort ──
  const filteredProducts = React.useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }

    // Category filter
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Stock status filter
    if (stockStatus !== "all") {
      result = result.filter((p) => p.status === stockStatus);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime(),
        );
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name, "ar"));
        break;
    }

    return result;
  }, [products, search, category, stockStatus, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // ── Handlers ──
  const handleAddProduct = (data: ProductFormData) => {
    const newProduct: Product = {
      id: Date.now().toString(),
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
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleEditProduct = (data: ProductFormData) => {
    if (!editProduct) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === editProduct.id
          ? {
              ...p,
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
              image: data.image || p.image,
              images: data.images?.length ? data.images : p.images,
            }
          : p,
      ),
    );
    setEditProduct(null);
  };

  const handleDeleteProduct = () => {
    if (!deleteProduct) return;
    setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
    setDeleteProduct(null);
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("all");
    setStockStatus("all");
    setSortBy("newest");
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
        <Button
          onClick={() => setAddModalOpen(true)}
          className="w-full sm:w-auto rounded-xl font-bold gap-2 px-6 h-11 self-start"
        >
          <Plus className="size-4" />
          إضافة منتج جديد
        </Button>
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
      />

      {/* Results count */}
      <p className="text-sm text-muted-foreground font-medium">
        عرض{" "}
        <span className="text-foreground font-bold">
          {filteredProducts.length}
        </span>{" "}
        منتج
        {search || category !== "all" || stockStatus !== "all"
          ? " ( النتائج المطابقة لخيارات التصفية )"
          : ""}
      </p>

      {/* Table or Empty State */}
      {filteredProducts.length === 0 ? (
        <ProductsEmptyState onAddProduct={() => setAddModalOpen(true)} />
      ) : (
        <ProductsTable
          products={paginatedProducts}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onEdit={(product) => setEditProduct(product)}
          onDelete={(product) => setDeleteProduct(product)}
        />
      )}

      {/* Add Product Modal */}
      <AddProductModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSave={handleAddProduct}
      />

      {/* Edit Product Modal */}
      <AddProductModal
        open={!!editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
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
      />
    </div>
  );
}
