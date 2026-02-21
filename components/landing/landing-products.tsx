"use client";

import Link from "next/link";
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import ProductCard from "./product-card";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";

const LandingProducts = () => {
  const [api_carousel, setApi] = React.useState<CarouselApi>();
  const [isInteracted, setIsInteracted] = React.useState(false);
  const restartTimeoutRef = React.useRef<NodeJS.Timeout>();
  const autoplayIntervalRef = React.useRef<NodeJS.Timeout>();

  // We'll use the existing list query but with a fixed pagination for simplicity on landing
  const productsResponse = useQuery(api.products.list, {
    paginationOpts: { numItems: 12, cursor: null },
    sortBy: "newest",
  });

  const products = productsResponse?.page || [];

  // Autoplay logic for mobile
  React.useEffect(() => {
    if (!api_carousel) return;

    const startAutoplay = () => {
      autoplayIntervalRef.current = setInterval(() => {
        api_carousel.scrollNext();
      }, 3000);
    };

    const stopAutoplay = () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
      }
    };

    const handleInteraction = () => {
      stopAutoplay();
      setIsInteracted(true);

      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }

      // Restart after 1 minute (60000 ms)
      restartTimeoutRef.current = setTimeout(() => {
        setIsInteracted(false);
        if (window.innerWidth < 1024) {
          startAutoplay();
        }
      }, 60000);
    };

    // Only start autoplay on mobile initially
    if (window.innerWidth < 1024 && !isInteracted) {
      startAutoplay();
    }

    api_carousel.on("pointerDown", handleInteraction);
    api_carousel.on("select", (api) => {
      // If triggered by button (manual), stop autoplay
      if (api.internalEngine().dragHandler.pointerDown()) {
        handleInteraction();
      }
    });

    return () => {
      stopAutoplay();
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
      api_carousel.off("pointerDown", handleInteraction);
    };
  }, [api_carousel, isInteracted]);

  if (productsResponse && products.length === 0) return null;

  return (
    <section id="products" className="py-20 overflow-hidden gradient-section">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            منتجاتنا <span className="text-primary">الأكثر رواجاً</span>
          </h2>
          <p className="text-foreground/70 font-medium text-lg leading-relaxed">
            اكتشفي مجموعتنا المختارة بعناية من أرقى المنتجات التي تجمع بين
            الجمال والجودة. كل قطعة تحكي قصة من الأناقة والتميز.
          </p>
        </div>

        {!productsResponse ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-[32px] bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="relative px-0 lg:px-12">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                direction: "rtl",
                loop: true,
              }}
              className="w-full relative group/carousel"
            >
              <CarouselContent className="-ml-4 sm:-ml-6">
                {products.map((product) => (
                  <CarouselItem
                    key={product._id}
                    className="pl-4 sm:pl-6 basis-full sm:basis-1/2 lg:basis-1/4"
                  >
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* PC Arrows: Absolute sides, hidden on mobile */}
              <CarouselPrevious className="hidden lg:flex absolute -left-24 top-1/2 -translate-y-1/2 size-12 rounded-full bg-primary text-white shadow-xl shadow-primary/5 hover:bg-primary/90 hover:text-white transition-all duration-300 z-20" />
              <CarouselNext className="hidden lg:flex absolute -right-24 top-1/2 -translate-y-1/2 size-12 rounded-full bg-primary text-white shadow-xl shadow-primary/5 hover:bg-primary/90 hover:text-white transition-all duration-300 z-20" />
            </Carousel>
          </div>
        )}

        <div className="mt-14 text-center">
          <Button className="rounded-full group h-11 font-medium px-7" asChild>
            <Link href="/products">
              تصفح جميع المنتجات
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LandingProducts;
