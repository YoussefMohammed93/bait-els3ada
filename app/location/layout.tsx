import SiteHeader from "@/components/landing/landing-header";
import SiteFooter from "@/components/landing/landing-footer";

export const metadata = {
  title: "موقعنا | بيت السعادة",
  description:
    "تعرف على موقع بيت السعادة — شربين – آخر شارع السلك – بجوار وكالة المكاوي.",
};

export default function LocationLayout({
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
