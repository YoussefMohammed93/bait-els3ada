import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin } from "lucide-react";

const SiteFooter = () => {
  const pageLinks = [
    { name: "المنتجات", href: "/products" },
    { name: "التصنيفات", href: "/categories" },
    { name: "موقعنا", href: "/location" },
  ];

  return (
    <footer className="bg-foreground">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5">
        {/* Main Grid */}
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 text-2xl font-bold text-primary-foreground">
              <Heart className="h-6 w-6 text-primary fill-primary" />
              بيت السعادة
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs">
              وجهتك المثالية للميكب والإكسسوارات والهدايا المميزة والمنتجات
              اليدوية الفريدة ✨
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary-foreground tracking-wide">
              روابط سريعة
            </h3>
            <nav className="flex flex-col gap-2.5">
              {pageLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-primary-foreground/60 hover:text-primary text-sm font-medium transition-colors w-fit"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary-foreground tracking-wide">
              تواصل معنا
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="tel:01017986283"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-primary-foreground/60 hover:text-primary text-sm font-medium transition-colors w-fit"
              >
                <Image
                  src="https://img.icons8.com/?size=100&id=hTTzWSpAOgIV&format=png&color=000000"
                  alt="phone"
                  width={24}
                  height={24}
                />
                <span dir="ltr">01017986283</span>
              </a>
              <a
                href="https://wa.me/201017986283"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-primary-foreground/60 hover:text-primary text-sm font-medium transition-colors w-fit"
              >
                <Image
                  src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000"
                  alt="whatsapp"
                  width={24}
                  height={24}
                />
                <span>واتساب</span>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61555229319127"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-primary-foreground/60 hover:text-primary text-sm font-medium transition-colors w-fit"
              >
                <Image
                  src="https://img.icons8.com/?size=100&id=uLWV5A9vXIPu&format=png&color=000000"
                  alt="facebook"
                  width={24}
                  height={24}
                />
                <span>فيسبوك</span>
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary-foreground tracking-wide">
              موقعنا
            </h3>
            <a
              href="https://www.google.com/maps?q=31.194746722234488,31.517451517772347"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 text-primary-foreground/60 hover:text-primary text-sm font-medium transition-colors w-fit"
            >
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                شربين – آخر شارع السلك – بجوار وكالة المكاوي
              </span>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-primary-foreground/50 text-xs font-medium">
            © {new Date().getFullYear()} بيت السعادة — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
