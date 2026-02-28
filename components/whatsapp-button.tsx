"use client";

import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const WhatsAppButton = () => {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  // Don't show on dashboard pages
  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check in case the page is already scrolled
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isDashboard) return null;

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <a
          href="https://wa.me/201017986283"
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed bottom-10 left-6 sm:left-10 z-50 p-2 rounded-full bg-[#25D366] ${
            show
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10 pointer-events-none"
          }`}
          aria-label="Contact on WhatsApp"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9">
            <Image
              src="/whatsapp.png"
              alt="WhatsApp"
              fill
              className="object-contain"
            />
          </div>
        </a>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        className="bg-[#20b958] text-white px-3 py-1.5 rounded-xl font-bold shadow-xl shadow-black/5"
        sideOffset={14}
      >
        تواصل معنا على واتساب
      </TooltipContent>
    </Tooltip>
  );
};

export default WhatsAppButton;
