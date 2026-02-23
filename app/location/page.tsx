import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, MessageCircle } from "lucide-react";

export default function LocationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="gradient-hero py-12 sm:py-8 border-b border-border/50">
        <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5 text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black text-foreground">
            <span className="text-primary">موقعنا</span>
          </h1>
          <p className="text-muted-foreground font-medium text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            زورونا في فرعنا الرئيسي — يسعدنا استقبالكم في أي وقت
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5 py-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Address Card */}
            <div className="flex flex-col items-center text-center gap-3 p-6 rounded-3xl bg-card border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1">
                  العنوان
                </h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  شربين – آخر شارع السلك – بجوار وكالة المكاوي
                </p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="flex flex-col items-center text-center gap-3 p-6 rounded-3xl bg-card border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1">
                  ساعات العمل
                </h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  يومياً من 10 صباحاً حتى 8 مساءً
                </p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="flex flex-col items-center text-center gap-3 p-6 rounded-3xl bg-card border border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="size-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm mb-1">
                  تواصل معنا
                </h3>
                <p
                  className="text-muted-foreground text-sm font-medium"
                  dir="ltr"
                >
                  01017986283
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="rounded-3xl overflow-hidden border border-border/50">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d266.7414583142326!2d31.517451517772347!3d31.194746722234488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg!4v1771356150885!5m2!1sen!2seg"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع بيت السعادة"
            />
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button
              size="lg"
              className="rounded-full text-base px-8 py-5"
              asChild
            >
              <a
                href="https://wa.me/201017986283"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
                تواصل معنا عبر واتساب
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
