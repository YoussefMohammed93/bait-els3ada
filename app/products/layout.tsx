import SiteHeader from "@/components/landing/landing-header";
import SiteFooter from "@/components/landing/landing-footer";

export const metadata = {
  title: "المنتجات | بيت السعادة",
  description:
    "تصفح جميع منتجاتنا المميزة من ميكب وإكسسوارات وهدايا وهاند ميد بأفضل الأسعار.",
};

export default function ProductsLayout({
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
