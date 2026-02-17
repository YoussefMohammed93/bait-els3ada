"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Heart, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLenis } from "@/components/smooth-scroll";

const SiteHeader = () => {
  const lenis = useLenis();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
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
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        scrolled
          ? "bg-background/90 border-border/60"
          : "bg-background/60 border-transparent"
      }`}
    >
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5 flex items-center justify-between h-16">
        <a
          href="#"
          className="flex items-center gap-2 text-xl font-bold text-foreground"
          onClick={(e) => {
            e.preventDefault();
            lenis?.scrollTo(0);
          }}
        >
          <Heart className="h-6 w-6 text-primary fill-primary" />
          بيت السعادة
        </a>
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
        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
                <Heart className="h-6 w-6 text-primary fill-primary" />
                بيت السعادة
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 mt-8">
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
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default SiteHeader;
