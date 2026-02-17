import { Heart, Phone, MapPin } from "lucide-react";

const SiteFooter = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5 text-center space-y-8">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary-foreground">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          بيت السعادة
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
          <a
            href="tel:01017986283"
            className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>01017986283</span>
          </a>
          <div className="hidden sm:block w-px h-4 bg-primary-foreground/20" />
          <div className="flex items-center gap-2 text-primary-foreground/80">
            <MapPin className="h-4 w-4" />
            <span>شربين – آخر شارع السلك – بجوار وكالة المكاوي</span>
          </div>
        </div>
        <p className="text-primary-foreground/80 text-sm">
          بيت السعادة – وجهتك لكل ما هو جميل ومميز ✨
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
