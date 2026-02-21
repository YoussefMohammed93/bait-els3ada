import Link from "next/link";
import Image from "next/image";

import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      href={`/products/${product._id}`}
      className="group relative flex flex-col bg-card rounded-[32px] overflow-hidden border border-border/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30"
    >
      {/* Image Container */}
      <div className="relative aspect-[2/1.8] sm:aspect-square overflow-hidden bg-white">
        <Image
          src={product.image || "/placeholder-product.jpg"}
          alt={product.name}
          fill
          className="object-cover rounded-[40px] p-5 transition-opacity duration-500 group-hover:opacity-90"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Category Badge */}
        <div className="absolute top-4 right-4 z-10">
          <span className="px-3 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-sm font-semibold uppercase tracking-wider text-primary border border-primary/10 shadow-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-0 flex flex-col flex-1">
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-black text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-muted-foreground block">
              السعر
            </span>
            <span className="text-xl font-black text-primary">
              {product.price}{" "}
              <span className="text-xs font-bold mr-0.5">ج.م</span>
            </span>
          </div>

          <div className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            تفاصيل المنتج
            <ArrowRight className="size-4 mt-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
