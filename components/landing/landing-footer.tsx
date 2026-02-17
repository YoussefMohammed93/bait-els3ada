import { Heart, Phone, MapPin } from "lucide-react";

const SiteFooter = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5 text-center space-y-6">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary-foreground">
          <Heart className="h-6 w-6 text-primary fill-primary" />
          بيت السعادة
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-primary-foreground/70">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span className="text-primary-foreground/75">01017986283</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-primary-foreground/75">شربين – آخر شارع السلك – بجوار وكالة المكاوي</span>
          </div>
        </div>

        <p className="text-primary-foreground/75 text-sm">
          بيت السعادة – وجهتك لكل ما هو جميل ومميز ✨
        </p>
      </div>
    </footer>
  );
};

export default SiteFooter;
