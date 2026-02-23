import SiteHeader from "@/components/landing/landing-header";
import SiteFooter from "@/components/landing/landing-footer";

export const metadata = {
  title: "التصنيفات | بيت السعادة",
  description:
    "تصفح جميع التصنيفات المتاحة في بيت السعادة واختار ما يناسبك من منتجات مميزة.",
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen">{children}</main>
      <SiteFooter />
    </>
  );
}
