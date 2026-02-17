import { MapPin } from "lucide-react";

const LocationSection = () => {
  return (
    <section id="location" className="py-20 gradient-section">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-5">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            <span className="text-primary">موقعنا</span>
          </h2>
          <div className="inline-flex items-center gap-2 text-foreground/70 bg-card border border-border/50 rounded-full px-5 py-2.5">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm sm:text-base font-medium">
              شربين – آخر شارع السلك – بجوار وكالة المكاوي
            </p>
          </div>
        </div>
        {/* Google Maps iframe */}
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-border/50">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d266.7414583142326!2d31.517451517772347!3d31.194746722234488!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2seg!4v1771356150885!5m2!1sen!2seg"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="موقع بيت السعادة"
          />
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
