"use client";

import {
  Heart,
  ShoppingCart,
  ChevronRight,
  Package,
  ZoomIn,
  ZoomOut,
  X,
  ChevronLeft,
  RotateCcw,
  Minus,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { useQuery } from "convex/react";
import { useCart } from "@/hooks/use-cart";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useWishlist } from "@/hooks/use-wishlist";
import ProductCard from "@/components/landing/product-card";
import { useState, useRef, useEffect, useCallback } from "react";

export default function ProductDetailPage({
  params,
}: {
  params: { productId: string };
}) {
  const product = useQuery(api.productsPublic.getById, {
    id: params.productId as Id<"products">,
  });

  const relatedProducts = useQuery(
    api.productsPublic.getRelated,
    product ? { category: product.category, excludeId: product._id } : "skip",
  );

  // ─── State ──────────────────────────────────────
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, items } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const isFavourite = product ? isInWishlist(product._id) : false;

  const isAlreadyInCart = items.some(
    (item) => item.productId === params.productId,
  );

  // Image modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  // Combine main image + additional images
  const allImages = product
    ? [
        product.image,
        ...(product.images || []).filter((img) => img !== product.image),
      ].filter(Boolean)
    : [];

  // ─── Modal Handlers ─────────────────────────────
  const openModal = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    document.body.style.overflow = "";
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.5, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleModalPrev = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev > 0 ? prev - 1 : allImages.length - 1,
    );
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [allImages.length]);

  const handleModalNext = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev < allImages.length - 1 ? prev + 1 : 0,
    );
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [allImages.length]);

  // Mouse drag for panning
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom <= 1) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY };
      panStart.current = { x: pan.x, y: pan.y };
    },
    [zoom, pan],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging || zoom <= 1) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy });
    },
    [isDragging, zoom],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch drag for mobile panning
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (zoom <= 1 || e.touches.length !== 1) return;
      const touch = e.touches[0];
      setIsDragging(true);
      dragStart.current = { x: touch.clientX, y: touch.clientY };
      panStart.current = { x: pan.x, y: pan.y };
    },
    [zoom, pan],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || zoom <= 1 || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const dx = touch.clientX - dragStart.current.x;
      const dy = touch.clientY - dragStart.current.y;
      setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy });
    },
    [isDragging, zoom],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse wheel zoom in modal
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!modalOpen) return;
      e.preventDefault();
      if (e.deltaY < 0) {
        setZoom((prev) => Math.min(prev + 0.3, 5));
      } else {
        setZoom((prev) => {
          const next = Math.max(prev - 0.3, 1);
          if (next === 1) setPan({ x: 0, y: 0 });
          return next;
        });
      }
    },
    [modalOpen],
  );

  // Double-click to toggle zoom
  const handleDoubleClick = useCallback(() => {
    if (zoom > 1) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      setZoom(2.5);
    }
  }, [zoom]);

  // Keyboard controls
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          closeModal();
          break;
        case "ArrowLeft":
          handleModalNext();
          break;
        case "ArrowRight":
          handleModalPrev();
          break;
        case "+":
        case "=":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "0":
          handleResetZoom();
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    modalOpen,
    handleModalNext,
    handleModalPrev,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    closeModal,
  ]);

  // ─── Cart Handlers ──────────────────────────────
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addItem(product._id, quantity);
    setAddedToCart(true);
    toast.success("تم اضافة المنتج للسلة");
    setTimeout(() => setAddedToCart(false), 2000);
  }, [product, quantity, addItem]);

  // ─── Loading State ──────────────────────────────
  if (product === undefined) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5 py-6 sm:py-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <div className="h-4 bg-muted rounded-lg w-16 animate-pulse" />
            <div className="h-3 w-3 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded-lg w-20 animate-pulse" />
            <div className="h-3 w-3 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded-lg w-32 animate-pulse" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Image Gallery skeleton */}
            <div className="flex-1 lg:max-w-[40%]">
              <div className="aspect-square rounded-[28px] bg-muted animate-pulse" />
              <div className="flex gap-3 mt-4 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-muted animate-pulse shrink-0"
                  />
                ))}
              </div>
            </div>

            {/* Details skeleton */}
            <div className="flex-1 space-y-6">
              <div className="h-4 bg-muted rounded-lg w-24 animate-pulse mb-2" />
              <div className="h-10 bg-muted rounded-lg w-3/4 animate-pulse" />
              <div className="h-8 bg-muted rounded-lg w-32 animate-pulse" />

              <div className="space-y-2 mt-4">
                <div className="h-4 bg-muted rounded-lg w-20 animate-pulse" />
                <div className="h-4 bg-muted rounded-lg w-full animate-pulse" />
                <div className="h-4 bg-muted rounded-lg w-5/6 animate-pulse" />
              </div>

              <div className="h-4 bg-muted rounded-full w-40 animate-pulse mt-4" />

              <div className="space-y-2 mt-6">
                <div className="h-4 bg-muted rounded-lg w-12 animate-pulse" />
                <div className="h-14 bg-muted rounded-2xl w-36 animate-pulse" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="h-14 bg-muted rounded-2xl flex-1 animate-pulse" />
                <div className="h-14 bg-muted rounded-2xl flex-1 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Related Products Skeleton */}
          <div className="mt-16 sm:mt-20">
            <div className="flex justify-between items-center mb-8">
              <div className="h-8 bg-muted rounded-lg w-48 animate-pulse" />
              <div className="h-10 bg-muted rounded-full w-24 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] bg-muted rounded-[24px] animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Not Found State ────────────────────────────
  if (product === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Package className="size-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            المنتج غير موجود
          </h1>
          <p className="text-muted-foreground font-medium">
            عذراً، لم نتمكن من العثور على هذا المنتج
          </p>
          <Button asChild className="rounded-full px-6 h-11 mt-4">
            <Link href="/products">تصفح المنتجات</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isInStock = product.stock > 0;

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5 py-6 sm:py-8">
          {/* ─── Breadcrumb ─────────────────────────── */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 sm:mb-8">
            <Link
              href="/"
              className="hover:text-primary transition-colors font-medium"
            >
              الرئيسية
            </Link>
            <ChevronLeft className="size-3.5" />
            <Link
              href="/products"
              className="hover:text-primary transition-colors font-medium"
            >
              المنتجات
            </Link>
            <ChevronLeft className="size-3.5" />
            <span className="text-foreground font-semibold truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>

          {/* ─── Product Content ────────────────────── */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* ─── Image Gallery ──────────────────── */}
            <div className="flex-1 lg:max-w-[40%]">
              {/* Main Image */}
              <div
                className="relative aspect-square overflow-hidden cursor-zoom-in group"
                onClick={() => openModal(selectedImageIndex)}
              >
                <Image
                  src={
                    allImages[selectedImageIndex] || "/placeholder-product.jpg"
                  }
                  alt={product.name}
                  fill
                  className="object-cover rounded-[28px] transition-all duration-500"
                  sizes="(max-width: 768px) 100vw, 55vw"
                  priority
                />
                {/* Zoom hint */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 md:opacity-0 group-hover:md:opacity-100 transition-opacity">
                  <ZoomIn className="size-3.5" />
                  اضغط للتكبير
                </div>
                {/* Category Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-sm font-semibold uppercase tracking-wider text-primary border border-primary/10 shadow-sm">
                    {product.category}
                  </span>
                </div>
                {/* Stock Badge */}
                {!isInStock && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-destructive/90 backdrop-blur-md text-sm font-semibold text-white">
                      نفذت الكمية
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all duration-200 ${
                        selectedImageIndex === index
                          ? "border-primary shadow-lg shadow-primary/10"
                          : "border-border/50 hover:border-primary/30"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - ${index + 1}`}
                        fill
                        className="object-cover rounded-2xl"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Product Details ────────────────── */}
            <div className="flex-1">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Category & Share */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/products?category=${encodeURIComponent(product.category)}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {product.category}
                  </Link>
                </div>

                {/* Name */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground leading-tight">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-primary">
                    {product.price}
                  </span>
                  <span className="text-lg font-bold text-primary/70">ج.م</span>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-foreground">
                    وصف المنتج
                  </h3>
                  <p className="text-muted-foreground font-medium leading-relaxed text-sm sm:text-base">
                    {product.description}
                  </p>
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  <div
                    className={`size-2.5 rounded-full ${isInStock ? "bg-emerald-500" : "bg-destructive"}`}
                  />
                  <span
                    className={`text-sm font-bold ${isInStock ? "text-emerald-600" : "text-destructive"}`}
                  >
                    {isInStock
                      ? `متاح (${product.stock} في المخزون)`
                      : "نفذت الكمية"}
                  </span>
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-foreground">الكمية</h3>
                  <div className="flex items-center gap-0 bg-white border border-border/50 rounded-2xl w-fit overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-4 hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      disabled={quantity <= 1}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="px-5 py-3 text-base font-bold min-w-[56px] text-center border-x border-border/50">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="p-4 hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col-reverse sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!isInStock || addedToCart || isAlreadyInCart}
                    className="w-full h-14 rounded-2xl text-base font-bold gap-2 transition-all"
                    size="lg"
                  >
                    <ShoppingCart className="size-5" />
                    {addedToCart || isAlreadyInCart
                      ? "تم اضافة المنتج للسلة"
                      : isInStock
                        ? "إضافة للسلة"
                        : "غير متاح"}
                  </Button>
                  <button
                    onClick={async () => {
                      if (!product) return;
                      const added = await toggleItem(product._id);
                      if (added) {
                        toast.success("تم الإضافة للمفضلة");
                      } else {
                        toast.info("تم الإزالة من المفضلة");
                      }
                    }}
                    className={`w-full h-14 gap-2 rounded-2xl border-2 bg-white flex items-center justify-center transition-all duration-300 ${
                      isFavourite
                        ? "bg-red-50 border-red-200 text-red-500"
                        : "border-border/50 text-muted-foreground hover:border-red-200 hover:text-red-400 hover:bg-red-50/50"
                    }`}
                  >
                    <Heart
                      className={`size-5 transition-all ${isFavourite ? "fill-current scale-110" : ""}`}
                    />
                    {isFavourite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Related Products ───────────────────── */}
          {relatedProducts && relatedProducts.length > 0 && (
            <section className="mt-16 sm:mt-20 pb-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                  منتجات <span className="text-primary">مشابهة</span>
                </h2>
                <Button
                  variant="outline"
                  asChild
                  className="rounded-full px-5 h-10 border-border/50 bg-white hover:bg-muted/50"
                >
                  <Link href="/products">عرض الكل</Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProducts.map((rp) => (
                  <ProductCard key={rp._id} product={rp} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* ─── Image Zoom Modal ────────────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="text-white/70 text-sm font-medium">
                {selectedImageIndex + 1} / {allImages.length}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleZoomOut}
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="تصغير"
                disabled={zoom <= 1}
              >
                <ZoomOut className="size-4 sm:size-5" />
              </button>
              <span className="text-white/70 text-sm font-medium min-w-[48px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="تكبير"
                disabled={zoom >= 5}
              >
                <ZoomIn className="size-4 sm:size-5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="إعادة ضبط"
              >
                <RotateCcw className="size-4 sm:size-5" />
              </button>
              <div className="w-px h-6 bg-white/20 mx-1 hidden sm:block" />
              <button
                onClick={closeModal}
                className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="إغلاق"
              >
                <X className="size-4 sm:size-5" />
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handleModalPrev}
                className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <ChevronRight className="size-6" />
              </button>
              <button
                onClick={handleModalNext}
                className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              >
                <ChevronLeft className="size-6" />
              </button>
            </>
          )}

          {/* Image */}
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
            style={{
              cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
            }}
          >
            <div
              className="relative transition-transform duration-150 ease-out"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                maxWidth: "90vw",
                maxHeight: "85vh",
                width: "100%",
                height: "100%",
              }}
            >
              <Image
                src={
                  allImages[selectedImageIndex] || "/placeholder-product.jpg"
                }
                alt={product.name}
                fill
                className="object-contain pointer-events-none"
                sizes="90vw"
                quality={95}
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom Thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-6">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                    }}
                    className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-white shadow-lg scale-110"
                        : "border-white/30 hover:border-white/60 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
