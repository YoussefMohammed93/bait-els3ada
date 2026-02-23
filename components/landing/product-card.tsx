import Link from "next/link";
import Image from "next/image";

import { toast } from "sonner";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useWishlist } from "@/hooks/use-wishlist";
import { Heart, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    _id: Id<"products">;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, items } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);

  const isFavourite = isInWishlist(product._id);
  const isAlreadyInCart = items.some((item) => item.productId === product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product._id, 1);
    setIsAdded(true);
    toast.success("تم اضافة المنتج للسلة");
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleItem(product._id);
    if (added) {
      toast.success("تم الإضافة للمفضلة");
    } else {
      toast.info("تم الإزالة من المفضلة");
    }
  };

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

        {/* Favorite Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-4 left-4 z-20 p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
            isFavourite
              ? "bg-red-500 text-white border-red-500"
              : "bg-white/90 text-muted-foreground border-primary/10 hover:bg-white hover:text-red-400"
          }`}
        >
          <Heart
            className={`size-4 transition-all ${isFavourite ? "fill-current scale-110" : ""}`}
          />
        </button>
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

          <Button
            onClick={handleAddToCart}
            disabled={isAdded || isAlreadyInCart}
            size="sm"
            className="rounded-full px-4 h-10 font-bold transition-all"
          >
            <ShoppingCart className="size-4" />
            {isAdded || isAlreadyInCart ? "تم الإضافة" : "إضافة للسلة"}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
