import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden border-b">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.jpg"
          alt="منتجات بيت السعادة"
          className="object-cover"
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/90 to-background/70 sm:from-background/95 sm:via-background/85 sm:to-background/40" />
      </div>
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5 relative z-10 py-20">
        {/* Hero content */}
        <div className="max-w-2xl space-y-8 animate-fade-up">
          <div className="inline-block rounded-full bg-accent/70 px-4 py-2 text-sm font-medium text-accent-foreground">
            مرحباً بكِ في عالم الجمال والتميّز ✨
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black !leading-snug text-foreground">
            بيت السعادة
            <br />
            <span className="text-primary">لكل تفاصيلك الجميلة</span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/85 leading-relaxed max-w-xl">
            وجهتك المثالية للميكب والإكسسوارات والهدايا المميزة والمنتجات
            اليدوية الفريدة. كل ما تحتاجينه لإطلالة ساحرة ولحظات لا تُنسى.
          </p>
          <Button
            size="lg"
            className="w-full sm:w-auto rounded-full text-lg px-8 py-6 shadow-soft"
            asChild
          >
            <a
              href="https://wa.me/201017986283"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-5 w-5" />
              تواصل معنا الآن
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
