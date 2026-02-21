"use client";

import {
  Pencil,
  Trash2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: "متوفر" | "كمية قليلة" | "غير متوفر";
  image: string;
  images?: string[];
  dateAdded: string;
  isCodAvailable?: boolean;
}

interface ProductsTableProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const statusConfig: Record<
  string,
  { className: string; Icon: React.ElementType }
> = {
  متوفر: {
    className: "bg-emerald-500/10 text-emerald-600",
    Icon: CheckCircle2,
  },
  "كمية قليلة": {
    className: "bg-orange-500/10 text-orange-600",
    Icon: AlertTriangle,
  },
  "غير متوفر": {
    className: "bg-destructive/10 text-destructive",
    Icon: XCircle,
  },
};

function ProductImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden flex-shrink-0 border flex items-center justify-center bg-muted ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={80}
        height={80}
        className="object-contain w-full h-full"
        onError={(e) => {
          // hide broken img, let bg color act as placeholder
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}

export function ProductsTable({
  products,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  return (
    <div>
      {/* ── Desktop Table ── */}
      <div className="hidden md:block rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm min-w-[860px]">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold w-[72px]">صورة</th>
                <th className="px-5 py-3.5 font-bold">اسم المنتج</th>
                <th className="px-5 py-3.5 font-bold">التصنيف</th>
                <th className="px-5 py-3.5 font-bold">السعر</th>
                <th className="px-5 py-3.5 font-bold">المخزون</th>
                <th className="px-5 py-3.5 font-bold text-center">الحالة</th>
                <th className="px-5 py-3.5 font-bold">تاريخ الإضافة</th>
                <th className="px-5 py-3.5 font-bold text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => {
                const { className: statusClass, Icon: StatusIcon } =
                  statusConfig[product.status];
                return (
                  <tr
                    key={product.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Image */}
                    <td className="px-5 py-3">
                      <ProductImage
                        src={product.image}
                        alt={product.name}
                        className="size-12"
                      />
                    </td>

                    {/* Name + desc */}
                    <td className="px-5 py-3 max-w-[200px]">
                      <p className="font-bold text-foreground text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 font-medium">
                        {product.description}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3">
                      <span className="inline-flex px-2.5 py-1 rounded-lg bg-muted text-xs font-bold text-muted-foreground whitespace-nowrap">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3 font-bold text-sm tabular-nums whitespace-nowrap">
                      {product.price.toLocaleString("ar-EG")} ج.م
                    </td>

                    {/* Stock */}
                    <td className="px-5 py-3 font-bold text-sm tabular-nums text-muted-foreground">
                      {product.stock}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusClass}`}
                        >
                          <StatusIcon className="size-3.5" />
                          {product.status}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3 text-muted-foreground font-medium text-sm whitespace-nowrap">
                      {product.dateAdded}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(product)}
                          className="rounded-lg h-8 px-2.5 text-xs font-bold gap-1 text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Pencil className="size-3.5" />
                          تعديل
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(product)}
                          className="rounded-lg h-8 px-2.5 text-xs font-bold gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" />
                          حذف
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="md:hidden space-y-3">
        {products.map((product) => {
          const { className: statusClass, Icon: StatusIcon } =
            statusConfig[product.status];
          return (
            <div
              key={product.id}
              className="rounded-2xl border bg-card p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="size-20"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-foreground text-base">
                    {product.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 font-medium">
                    {product.description}
                  </p>
                  <div className="flex items-center flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-muted-foreground bg-muted">
                      {product.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${statusClass}`}
                    >
                      <StatusIcon className="size-3.5" />
                      {product.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 border-t pt-3 text-sm">
                <div>
                  <span className="text-sm text-muted-foreground font-bold block uppercase tracking-wider">
                    السعر
                  </span>
                  <span className="font-bold text-foreground text-sm tabular-nums">
                    {product.price.toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground font-bold block uppercase tracking-wider">
                    المخزون
                  </span>
                  <span className="font-bold text-foreground text-sm tabular-nums">
                    {product.stock}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground font-bold block uppercase tracking-wider">
                    التاريخ
                  </span>
                  <span className="font-bold text-muted-foreground text-sm">
                    {product.dateAdded}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(product)}
                  className="flex-1 rounded-xl h-9 text-xs font-bold gap-1.5 text-primary border-primary/20 hover:bg-primary/5"
                >
                  <Pencil className="size-3.5" />
                  تعديل
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(product)}
                  className="flex-1 rounded-xl h-9 text-xs font-bold gap-1.5 text-destructive border-destructive/20 hover:bg-destructive/5"
                >
                  <Trash2 className="size-3.5" />
                  حذف
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-muted-foreground font-medium">
            صفحة {currentPage} من {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                className="size-8 rounded-lg text-xs font-bold"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
