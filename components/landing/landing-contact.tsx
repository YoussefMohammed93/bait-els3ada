import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";

const ContactSection = () => {
  return (
    <section id="contact" className="py-20">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            تواصلي <span className="text-primary">معانا</span>
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed font-medium">
            عايزة تسألي عن حاجة أو تطلبي أوردر؟ كلمينا دلوقتي!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              className="rounded-full !shadow-none text-lg px-8 py-6 w-full sm:w-auto"
              asChild
            >
              <a
                href="https://wa.me/201017986283"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
                واتساب
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full shadow-none text-lg px-8 py-6 w-full sm:w-auto border-primary/30 text-foreground hover:bg-muted hover:border-border transition-colors"
              asChild
            >
              <a href="tel:01017986283">
                <Phone className="h-5 w-5" />
                اتصل بنا
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
