import Link from "next/link";
import { Heart, ArrowRight, Home } from "lucide-react";
import SiteHeader from "@/components/landing/landing-header";
import SiteFooter from "@/components/landing/landing-footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      <main className="flex-grow flex items-center justify-center py-20 px-4 gradient-section relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 -left-20 w-60 h-60 sm:w-80 sm:h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 -right-20 w-60 h-60 sm:w-80 sm:h-80 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        <div className="w-full max-w-2xl mx-auto text-center space-y-8 relative z-10">
          <div className="relative inline-block">
            <h1 className="text-[120px] sm:text-[180px] font-black text-primary/10 tracking-tighter leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background/80 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-primary/20 shadow-2xl shadow-primary/10 transform -rotate-3 hover:rotate-0 transition-transform duration-500 group">
                <Heart className="h-16 w-16 text-primary fill-primary animate-bounce group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>

          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">
              عذراً.. هذه الصفحة غير موجودة أو تم حذفها!
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              يبدو أن الرابط الذي اتبعته غير صحيح أو أن الصفحة لم تعد متوفرة. لا
              تقلق، يمكنك العودة للرئيسية ومتابعة التسوق في &quot;بيت
              السعادة&quot;.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Button
              asChild
              size="lg"
              className="rounded-2xl px-8 h-12 text-base font-bold gap-2 group transition-all"
            >
              <Link href="/">
                <Home className="h-5 w-5" />
                العودة للرئيسية
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-2xl px-8 h-12 text-base font-bold gap-2 border-primary/20 hover:bg-muted/50 transition-all"
            >
              <Link href="/products">
                تصفح المنتجات
                <ArrowRight className="h-5 w-5 rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
