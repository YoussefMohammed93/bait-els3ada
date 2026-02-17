import Image from "next/image";

const features = [
  {
    image: "/leader.png",
    title: "تنوع فريد",
    description: "تشكيلة واسعة من المنتجات تناسب كل الأذواق والمناسبات",
  },
  {
    image: "/medal.png",
    title: "جودة عالية",
    description: "نختار لكِ أفضل المنتجات بعناية فائقة لضمان رضاكِ",
  },
  {
    image: "/money.png",
    title: "أسعار مناسبة",
    description: "أسعار تنافسية تناسب الجميع مع الحفاظ على الجودة",
  },
  {
    image: "/ring.png",
    title: "لمسة خاصة",
    description: "نضيف لمسة فنية مميزة لكل هدية ومنتج يدوي",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 gradient-section border-b">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            ليه تختاري <span className="text-primary">بيت السعادة؟</span>
          </h2>
          <p className="text-foreground/80 text-lg leading-relaxed font-medium">
            لأننا نؤمن إن كل تفصيلة صغيرة بتفرق، بنقدملك منتجات مختارة بعناية
            وحب، عشان كل لحظة تبقى مميزة ومليانة سعادة.
          </p>
        </div>
        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-7 text-center border border-border/90"
            >
              <div className="w-20 h-20 mx-auto mb-5 relative">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-contain"
                  sizes="80px"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-foreground/80 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
