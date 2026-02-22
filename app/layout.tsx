import "./globals.css";

import type { Metadata } from "next";

import { Tajawal } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

import SmoothScrollProvider from "@/components/smooth-scroll";

import { ConvexClientProvider } from "./convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "بيت السعادة | وجهتك للجمال والتميز",
  description:
    "وجهتك المثالية للميكب والإكسسوارات والهدايا المميزة والمنتجات اليدوية الفريدة. كل ما تحتاجينه لإطلالة ساحرة ولحظات لا تُنسى.",
  keywords: [
    "بيت السعادة",
    "ميكب",
    "إكسسوارات",
    "هدايا",
    "هاند ميد",
    "طباعة",
    "شربين",
  ],
  openGraph: {
    title: "بيت السعادة | وجهتك للجمال والتميز",
    description:
      "وجهتك المثالية للميكب والإكسسوارات والهدايا المميزة والمنتجات اليدوية الفريدة.",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="ar" dir="rtl">
        <body className={`${tajawal.variable} antialiased`}>
          <SmoothScrollProvider>
            <ConvexClientProvider>
              {children}
              <Toaster />
            </ConvexClientProvider>
          </SmoothScrollProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
