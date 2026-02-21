import HeroSection from "@/components/landing/landing-hero";
import SiteFooter from "@/components/landing/landing-footer";
import SiteHeader from "@/components/landing/landing-header";
import AboutSection from "@/components/landing/landing-about";
// import ContactSection from "@/components/landing/landing-contact";
import ServicesSection from "@/components/landing/landing-services";
import LandingProducts from "@/components/landing/landing-products";
import dynamic from "next/dynamic";

const LocationSection = dynamic(
  () => import("@/components/landing/landing-location"),
  {
    loading: () => (
      <div className="py-20 gradient-section border-b">
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5">
          <div className="max-w-4xl mx-auto h-[400px] rounded-2xl bg-muted animate-pulse" />
        </div>
      </div>
    ),
  },
);

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <LandingProducts />
        <LocationSection />
        {/* <ContactSection /> */}
      </main>
      <SiteFooter />
    </>
  );
}
