"use client";

import React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface WhatsAppOrderButtonProps {
  productName: string;
  productPrice: number;
  productUrl: string;
  selectedColor?: string;
  selectedSize?: string;
  quantity?: number;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  whatsappNumber?: string; // e.g. "201012345678"
  label?: string;
}

export const WhatsAppOrderButton = ({
  productName,
  productPrice,
  productUrl,
  selectedColor,
  selectedSize,
  quantity = 1,
  className,
  size = "default",
  whatsappNumber = "201017986283",
  label,
}: WhatsAppOrderButtonProps) => {
  const handleOrder = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const message = `السلام عليكم
أريد طلب المنتج التالي:

اسم المنتج: ${productName}
السعر: ${productPrice} جنيه
${selectedColor ? `اللون: ${selectedColor}` : ""}
${selectedSize ? `المقاس: ${selectedSize}` : ""}
الكمية: ${quantity}

رابط المنتج:
${productUrl}

شكراً`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button
      onClick={handleOrder}
      size={size}
      className={cn(
        "bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-2xl transition-all duration-300 active:scale-95 gap-2",
        className,
      )}
    >
      <Image src="/whatsapp.png" alt="whatsapp" width={20} height={20} />
      <span>{label || "اطلب الآن عبر واتساب"}</span>
    </Button>
  );
};
