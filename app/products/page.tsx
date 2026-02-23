"use client";

import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  PackageSearch,
  Loader2,
  ArrowUp,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useQuery, usePaginatedQuery } from "convex/react";
import ProductCard from "@/components/landing/product-card";
import { useState, useCallback, useEffect, useRef } from "react";

type SortOption = "newest" | "oldest" | "price-high" | "price-low" | "name";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "الأحدث" },
  { value: "oldest", label: "الأقدم" },
  { value: "price-high", label: "السعر: الأعلى" },
  { value: "price-low", label: "السعر: الأقل" },
  { value: "name", label: "الاسم" },
];

const ITEMS_PER_PAGE = 9;

export default function ProductsPage() {
  // ─── State ──────────────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | undefined>();
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | undefined>();
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // ─── Debounce search ────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll to top button visibility
  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ─── Data ───────────────────────────────────────────
  const categories = useQuery(api.categories.list);
  const {
    results: allProducts,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.productsPublic.listPublic,
    {
      search: debouncedSearch || undefined,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      sortBy,
      minPrice: appliedMinPrice,
      maxPrice: appliedMaxPrice,
    },
    { initialNumItems: ITEMS_PER_PAGE },
  );

  // ─── Handlers ───────────────────────────────────────
  const handleLoadMore = useCallback(() => {
    loadMore(ITEMS_PER_PAGE);
  }, [loadMore]);

  const handleApplyPrice = () => {
    setAppliedMinPrice(minPrice ? Number(minPrice) : undefined);
    setAppliedMaxPrice(maxPrice ? Number(maxPrice) : undefined);
  };

  const handleClearPrice = () => {
    setMinPrice("");
    setMaxPrice("");
    setAppliedMinPrice(undefined);
    setAppliedMaxPrice(undefined);
  };

  const handleClearAll = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setSelectedCategory("all");
    setSortBy("newest");
    handleClearPrice();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Derived ────────────────────────────────────────
  const isInitialLoading = status === "LoadingFirstPage";
  const isLoadingMore = status === "LoadingMore";
  const isDone = status === "Exhausted";
  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (appliedMinPrice !== undefined ? 1 : 0) +
    (appliedMaxPrice !== undefined ? 1 : 0) +
    (debouncedSearch ? 1 : 0) +
    (sortBy !== "newest" ? 1 : 0);

  const hasResults = allProducts.length > 0;

  // ─── Filter Sidebar JSX (rendered inline to avoid remount) ───
  const filterContentJSX = (onClose?: () => void) => (
    <div className="space-y-5">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">التصنيفات</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setSelectedCategory("all");
              onClose?.();
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-secondary-foreground hover:bg-muted"
            }`}
          >
            الكل
          </button>
          {categories?.map((cat) => (
            <button
              key={cat._id}
              onClick={() => {
                setSelectedCategory(cat.name);
                onClose?.();
              }}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedCategory === cat.name
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/60 text-secondary-foreground hover:bg-muted"
              }`}
            >
              {cat.name}
              <span className="mr-1.5 text-xs opacity-70">
                ({cat.productsCount})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground">نطاق السعر</h3>
          {(minPrice || maxPrice) && (
            <button
              onClick={handleClearPrice}
              className="text-xs text-primary hover:underline"
            >
              مسح
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              type="number"
              placeholder="من"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-10 rounded-xl text-sm pr-3 pl-10"
              min={0}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              ج.م
            </span>
          </div>
          <span className="text-muted-foreground text-sm">—</span>
          <div className="relative flex-1">
            <Input
              type="number"
              placeholder="إلى"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-10 rounded-xl text-sm pr-3 pl-10"
              min={0}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              ج.م
            </span>
          </div>
        </div>
        <Button
          onClick={() => {
            handleApplyPrice();
            onClose?.();
          }}
          className="w-full mt-3 rounded-xl h-10"
          disabled={!minPrice && !maxPrice}
        >
          تطبيق
        </Button>
      </div>

      {/* Sort (mobile only — desktop has its own dropdown) */}
      <div className="lg:hidden">
        <h3 className="text-sm font-bold text-foreground mb-3">ترتيب حسب</h3>
        <div className="space-y-1.5">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSortBy(opt.value);
                onClose?.();
              }}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                sortBy === opt.value
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear All */}
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={() => {
            handleClearAll();
            onClose?.();
          }}
          className="w-full rounded-xl h-10 bg-white hover:bg-muted/50"
        >
          <X className="size-4" />
          مسح جميع الفلاتر
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background" ref={topRef}>
      {/* ─── Hero Banner ───────────────────────────────── */}
      <section className="gradient-hero py-12 sm:py-8 border-b border-border/50">
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">
            جميع <span className="text-primary">المنتجات</span>
          </h1>
          <p className="text-muted-foreground font-medium text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            اكتشفي مجموعتنا الكاملة من المنتجات المميزة — اختاري ما يناسبك
            بسهولة مع خيارات البحث والتصفية المتقدمة
          </p>
        </div>
      </section>

      {/* ─── Main Content ──────────────────────────────── */}
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5 py-8">
        {/* ─── Top Bar: Search + Sort + Mobile Filter ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-11 pr-10 pl-4 rounded-2xl bg-card border-border/50 text-sm focus-visible:ring-primary/30"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort (desktop) */}
            <div className="relative hidden lg:block" ref={sortRef}>
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 h-11 px-4 rounded-2xl bg-card border border-border/50 text-sm font-medium text-foreground hover:border-primary/30 transition-colors"
              >
                {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                <ChevronDown
                  className={`size-4 text-muted-foreground transition-transform duration-200 ${showSortDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {showSortDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border border-border/50 shadow-xl shadow-black/5 z-50 min-w-[160px]">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(opt.value);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-right px-4 py-2.5 text-sm font-medium transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                        sortBy === opt.value
                          ? "text-primary bg-primary/5"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Filters Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto lg:hidden h-11 rounded-2xl gap-2 bg-white hover:bg-muted border-border/50 relative"
                >
                  <SlidersHorizontal className="size-4" />
                  <span className="text-sm font-medium">فلاتر</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1.5 -left-1.5 size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[380px]">
                <SheetHeader>
                  <SheetTitle className="text-lg font-bold">الفلاتر</SheetTitle>
                </SheetHeader>
                <div className="mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                  {filterContentJSX(() => setMobileFiltersOpen(false))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters Pills */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs font-bold text-muted-foreground">
              الفلاتر النشطة:
            </span>
            {debouncedSearch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                بحث: {debouncedSearch}
                <button onClick={() => setSearchInput("")}>
                  <X className="size-3" />
                </button>
              </span>
            )}
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {selectedCategory}
                <button onClick={() => setSelectedCategory("all")}>
                  <X className="size-3" />
                </button>
              </span>
            )}
            {appliedMinPrice !== undefined && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                من {appliedMinPrice} ج.م
                <button
                  onClick={() => {
                    setMinPrice("");
                    setAppliedMinPrice(undefined);
                  }}
                >
                  <X className="size-3" />
                </button>
              </span>
            )}
            {appliedMaxPrice !== undefined && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                إلى {appliedMaxPrice} ج.م
                <button
                  onClick={() => {
                    setMaxPrice("");
                    setAppliedMaxPrice(undefined);
                  }}
                >
                  <X className="size-3" />
                </button>
              </span>
            )}
            {sortBy !== "newest" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                <button onClick={() => setSortBy("newest")}>
                  <X className="size-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearAll}
              className="text-xs text-destructive hover:underline font-semibold mr-2"
            >
              مسح الكل
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* ─── Desktop Sidebar ─────────────────────── */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-24 bg-card rounded-3xl border border-border/50 p-6 space-y-0">
              <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-primary" />
                الفلاتر
                {activeFiltersCount > 0 && (
                  <span className="size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </h2>
              {filterContentJSX()}
            </div>
          </aside>

          {/* ─── Products Grid ───────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            {!isInitialLoading && hasResults && (
              <div className="mb-5">
                <p className="text-sm text-muted-foreground font-medium">
                  عرض{" "}
                  <span className="font-bold text-foreground">
                    {allProducts.length}
                  </span>{" "}
                  منتج
                  {!isDone && "+"}
                </p>
              </div>
            )}

            {/* Loading State */}
            {isInitialLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[32px] bg-card border border-border/50 overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square bg-muted" />
                    <div className="p-5 space-y-3">
                      <div className="h-5 bg-muted rounded-lg w-3/4" />
                      <div className="h-3 bg-muted rounded-lg w-full" />
                      <div className="h-3 bg-muted rounded-lg w-1/2" />
                      <div className="flex justify-between items-center pt-3 border-t border-border/50">
                        <div className="h-6 bg-muted rounded-lg w-20" />
                        <div className="h-4 bg-muted rounded-lg w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isInitialLoading && !hasResults && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <PackageSearch className="size-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  لا توجد منتجات
                </h3>
                <p className="text-muted-foreground font-medium max-w-sm mb-6">
                  {debouncedSearch
                    ? `لم نجد نتائج لـ "${debouncedSearch}". جرب كلمات بحث مختلفة أو قم بمسح الفلاتر.`
                    : "لم نجد منتجات تطابق الفلاتر المحددة. جرب تغيير الفلاتر أو مسح الكل."}
                </p>
                {activeFiltersCount > 0 && (
                  <Button
                    onClick={handleClearAll}
                    className="rounded-full px-6 h-11 "
                  >
                    <X className="size-4" />
                    مسح جميع الفلاتر
                  </Button>
                )}
              </div>
            )}

            {/* Products */}
            {hasResults && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {allProducts.map((product, index) => (
                  <div
                    key={product._id}
                    className="products-card-animate"
                    style={{
                      animationDelay: `${(index % ITEMS_PER_PAGE) * 60}ms`,
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}

            {/* Load More */}
            {hasResults && !isDone && (
              <div className="flex justify-center mt-10">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  variant="outline"
                  className="rounded-full px-8 h-12 gap-2 bg-white hover:bg-muted/50"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      جاري التحميل...
                    </>
                  ) : (
                    "عرض المزيد"
                  )}
                </Button>
              </div>
            )}

            {/* End message */}
            {hasResults && isDone && allProducts.length > ITEMS_PER_PAGE && (
              <div className="text-center mt-10">
                <p className="text-sm text-muted-foreground font-medium">
                  لقد وصلت لنهاية المنتجات...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 left-6 z-50 size-12 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center transition-all duration-300 hover:bg-primary/90 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="size-5" />
      </button>
    </div>
  );
}
