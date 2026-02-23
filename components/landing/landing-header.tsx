"use client";

import {
  Heart,
  Menu,
  LogOut,
  LayoutDashboard,
  Package,
  Settings,
  ChevronDown,
  LogIn,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NextImage from "next/image";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLenis } from "@/components/smooth-scroll";
import { useConvexAuth, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { AuthDialog } from "@/components/auth/auth-form";
import { MyOrdersDialog } from "@/components/orders/my-orders-dialog";

const SiteHeader = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  const user = useQuery(api.users.currentUser);
  const { totalItems } = useCart();

  const lenis = useLenis();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!lenis) return;

    const anchors = document.querySelectorAll('a[href^="#"]');

    const handleClick = (e: Event) => {
      e.preventDefault();
      const anchor = e.currentTarget as HTMLAnchorElement;
      const href = anchor.getAttribute("href");
      if (href) {
        const target = document.querySelector(href);
        if (target) {
          lenis.scrollTo(target as HTMLElement);
        }
      }
    };

    anchors.forEach((anchor) => {
      anchor.addEventListener("click", handleClick);
    });

    return () => {
      anchors.forEach((anchor) => {
        anchor.removeEventListener("click", handleClick);
      });
    };
  }, [lenis]);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsOpen(false);
    if (lenis) {
      const target = document.querySelector(href);
      if (target) {
        lenis.scrollTo(target as HTMLElement);
      }
    }
  };

  const navLinks = [
    { name: "من نحن", href: "#about" },
    { name: "خدماتنا", href: "#services" },
    { name: "موقعنا", href: "#location" },
    { name: "تواصل معنا", href: "#contact" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
          scrolled
            ? "bg-background/90 border-border/60"
            : "bg-background/60 border-transparent"
        }`}
      >
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5 flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-foreground"
          >
            <Heart className="h-6 w-6 text-primary fill-primary" />
            بيت السعادة
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-muted-foreground">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="nav-link hover:text-primary text-base transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Cart Button */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full border bg-white hover:bg-primary/5 hover:text-primary transition-all group"
              >
                <ShoppingCart className="h-5 w-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-background animate-in zoom-in">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {!mounted || isLoading ? (
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 sm:w-32 rounded-full" />
              </div>
            ) : (
              <>
                {isAuthenticated ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 pl-2 pr-0 h-10 rounded-full border bg-white hover:bg-muted transition-all group"
                      >
                        <div className="relative w-9 h-9 rounded-full overflow-hidden">
                          {user?.image ? (
                            <NextImage
                              src={user.image}
                              alt={user.name || "User"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <NextImage
                              src="/default.jpg"
                              alt="Default User"
                              fill
                              className="object-cover opacity-60"
                            />
                          )}
                        </div>
                        <span
                          className="max-w-[125px] truncate text-sm font-normal hidden sm:inline-block"
                          dir="ltr"
                        >
                          {user?.name || "المستخدم"}
                        </span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform duration-200 mt-0.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="w-72 p-0 px-0 rounded-2xl overflow-hidden"
                      sideOffset={8}
                    >
                      <div className="flex flex-col">
                        {/* User Header */}
                        <div className="p-4 border-b flex items-center justify-between gap-3">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                            {user?.image ? (
                              <NextImage
                                src={user.image}
                                alt={user.name || "User"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <NextImage
                                src="/default.jpg"
                                alt="Default User"
                                fill
                                className="object-cover opacity-60"
                              />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span
                              className="font-bold text-base truncate"
                              dir="ltr"
                            >
                              {user?.name || "المستخدم"}
                            </span>
                            <span
                              className="text-xs text-muted-foreground truncate"
                              dir="ltr"
                            >
                              {user?.email}
                            </span>
                          </div>
                        </div>
                        {/* Activity Section */}
                        <div className="p-2">
                          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                            نشاطي
                          </p>
                          <Button
                            variant="ghost"
                            onClick={() => setOrdersOpen(true)}
                            className="w-full justify-start gap-3 h-10 px-3 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                          >
                            <Package className="h-4 w-4" />
                            <span className="text-sm font-medium">طلباتي</span>
                          </Button>
                          <Link href="/wishlist" className="w-full">
                            <Button
                              variant="ghost"
                              className="w-full justify-start gap-3 h-10 px-3 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                            >
                              <Heart className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                قائمة المفضلة
                              </span>
                            </Button>
                          </Link>
                        </div>
                        {/* Account Section */}
                        <div className="p-2 pt-0 border-t">
                          <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                            الحساب
                          </p>
                          <Link href="/settings" className="w-full">
                            <Button
                              variant="ghost"
                              className="w-full justify-start gap-3 h-10 px-3 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                            >
                              <Settings className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                الإعدادات
                              </span>
                            </Button>
                          </Link>
                          {user?.userRole === "admin" && (
                            <Link href="/dashboard" className="w-full">
                              <Button
                                variant="ghost"
                                className="w-full justify-start gap-3 h-10 px-3 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                              >
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  لوحة التحكم
                                </span>
                              </Button>
                            </Link>
                          )}
                        </div>
                        {/* Footer Section */}
                        <div className="p-2 pt-2 border-t">
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-10 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            onClick={() => signOut()}
                          >
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              تسجيل الخروج
                            </span>
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Button
                    variant="default"
                    className="rounded-xl px-4 hidden md:inline-flex"
                    onClick={() => setAuthOpen(true)}
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="text-sm font-medium">تسجيل الدخول</span>
                  </Button>
                )}
              </>
            )}
            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                    <Heart className="h-6 w-6 text-primary fill-primary" />
                    بيت السعادة
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 mt-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium text-foreground hover:text-primary hover:bg-accent/50 transition-colors rounded-xl px-4 py-3"
                      onClick={(e) => handleLinkClick(e, link.href)}
                    >
                      {link.name}
                    </a>
                  ))}
                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-4 h-14 px-4 hover:bg-primary/5 hover:text-primary rounded-xl transition-colors"
                      onClick={() => {
                        setIsOpen(false);
                        setOrdersOpen(true);
                      }}
                    >
                      <Package className="h-5 w-5" />
                      <span className="text-base font-medium">طلباتي</span>
                    </Button>
                  )}
                  {!mounted || isLoading ? (
                    <Skeleton className="w-full mt-4 rounded-xl h-12 md:hidden" />
                  ) : (
                    !isAuthenticated && (
                      <Button
                        variant="default"
                        className="w-full mt-4 rounded-xl h-12 text-base md:hidden"
                        onClick={() => {
                          setIsOpen(false);
                          setAuthOpen(true);
                        }}
                      >
                        <LogIn className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          تسجيل الدخول
                        </span>
                      </Button>
                    )
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <MyOrdersDialog open={ordersOpen} onOpenChange={setOrdersOpen} />
    </>
  );
};

export default SiteHeader;
