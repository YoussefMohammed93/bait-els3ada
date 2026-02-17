import "./globals.css";
import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import SmoothScrollProvider from "@/components/smooth-scroll";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "بيت السعادة | وجهتك للجمال والتميز",
  description:
    "وجهتك المثالية للميكب والإكسسوارات والهدايا المميزة والمنتجات اليدوية الفريدة. كل ما تحتاجينه لإطلالة ساحرة ولحظات لا تُنسى.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${tajawal.variable} antialiased`}>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
