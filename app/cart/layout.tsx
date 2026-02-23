import SiteHeader from "@/components/landing/landing-header";
import SiteFooter from "@/components/landing/landing-footer";

export const metadata = {
  title: "سلة التسوق | بيت السعادة",
  description: "راجع منتجاتك المختارة وأكمل عملية الشراء بسهولة وأمان.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[80vh] flex flex-col">{children}</main>
      <SiteFooter />
    </>
  );
}
