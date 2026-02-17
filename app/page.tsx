import HeroSection from "@/components/landing/landing-hero";
import SiteFooter from "@/components/landing/landing-footer";
import SiteHeader from "@/components/landing/landing-header";
import AboutSection from "@/components/landing/landing-about";
import ContactSection from "@/components/landing/landing-contact";
import LocationSection from "@/components/landing/landing-location";
import ServicesSection from "@/components/landing/landing-services";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <LocationSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
