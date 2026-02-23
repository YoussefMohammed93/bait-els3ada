"use client";

import Link from "next/link";
import NextImage from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowLeft, Layers, Package } from "lucide-react";

export default function CategoriesPage() {
  const categories = useQuery(api.categories.list);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="gradient-hero py-12 sm:py-8 border-b border-border/50">
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">
            جميع <span className="text-primary">التصنيفات</span>
          </h1>
          <p className="text-muted-foreground font-medium text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            اكتشفي مجموعاتنا المتنوعة من التصنيفات — اختاري التصنيف الذي يناسبك
            وتصفحي أفضل المنتجات
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5 py-10">
        {!categories ? (
          /* Loading skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-card border border-border/50 overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] bg-muted" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-muted rounded-lg w-1/2" />
                  <div className="h-4 bg-muted rounded-lg w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Layers className="size-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              لا توجد تصنيفات بعد
            </h3>
            <p className="text-muted-foreground font-medium max-w-sm">
              سيتم إضافة التصنيفات قريباً، تابعونا!
            </p>
          </div>
        ) : (
          /* Categories Cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={category._id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="group block products-card-animate"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="rounded-3xl bg-card border border-border/50 overflow-hidden transition-all duration-300 hover:border-primary/30">
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                    {category.image ? (
                      <NextImage
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/15">
                        <Layers className="size-16 text-primary/30" />
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    {/* Category name on image */}
                    <div className="absolute bottom-0 right-0 left-0 p-5">
                      <h2 className="text-xl font-bold text-white drop-shadow-md">
                        {category.name}
                      </h2>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="size-4 text-primary" />
                      <span className="text-sm font-semibold">
                        {category.productsCount} منتج
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-primary text-sm font-semibold">
                      <span>تصفح</span>
                      <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
