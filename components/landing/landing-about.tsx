import Image from "next/image";

const features = [
  {
    image: "/leader.png",
    title: "تنوع فريد",
    description: "تشكيلة واسعة من المنتجات تناسب كل الأذواق والمناسبات",
    color: "bg-violet-500/10",
  },
  {
    image: "/medal.png",
    title: "جودة عالية",
    description: "نختار لكِ أفضل المنتجات بعناية فائقة لضمان رضاكِ",
    color: "bg-amber-500/10",
  },
  {
    image: "/money.png",
    title: "أسعار مناسبة",
    description: "أسعار تنافسية تناسب الجميع مع الحفاظ على الجودة",
    color: "bg-emerald-500/10",
  },
  {
    image: "/ring.png",
    title: "لمسة خاصة",
    description: "نضيف لمسة فنية مميزة لكل هدية ومنتج يدوي",
    color: "bg-primary/10",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 gradient-section">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            ليه تختاري <span className="text-primary">بيت السعادة؟</span>
          </h2>
          <p className="text-foreground/70 font-medium text-lg leading-relaxed">
            لأننا نؤمن إن كل تفصيلة صغيرة بتفرق، بنقدملك منتجات مختارة بعناية
            وحب، عشان كل لحظة تبقى مميزة ومليانة سعادة.
          </p>
        </div>
        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-7 text-center border border-border/50 hover:border-primary/50 transition-colors duration-300"
            >
              <div
                className={`w-[88px] h-[88px] mx-auto mb-5 relative rounded-2xl ${feature.color} flex items-center justify-center`}
              >
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={60}
                  height={60}
                  className="object-contain"
                  sizes="60px"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-foreground/65 leading-relaxed text-[15px] font-medium">
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
