import Image from "next/image";

const services = [
  {
    image: "/cosmetic-accessories.png",
    title: "ميكب و إكسسوارات",
    description:
      "تألقي بأحدث مستحضرات التجميل وأرقى الإكسسوارات التي تضفي لمسة من الجمال والجاذبية على إطلالتك",
  },
  {
    image: "/giftbox.png",
    title: "هدايا",
    description:
      "هدايا مميزة لكل المناسبات مغلفة بأجمل الطرق عشان تفرحي اللي بتحبيهم",
  },
  {
    image: "/handcraft.png",
    title: "هاند ميد",
    description:
      "جميع أنواع الطارات ومناديل كتب الكتاب وتوزيعات الأفراح والسبوع. تجهيزات كاملة للعرايس والمناسبات",
  },
  {
    image: "/print.png",
    title: "طباعة حسب الطلب",
    description:
      "تتميز خدماتنا بالتنوع والجودة العالية: طباعة ديجيتال بطبقة حماية، طباعة حرارية، وحفر ليزر على المجات",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 border-b">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            خدماتنا <span className="text-primary">المميزة</span>
          </h2>
          <p className="text-foreground/80 text-lg font-medium">
            لأنكِ تستحقين التميز في كل تفصيلة، جمعنا لكِ عالمًا من الجمال،
            الأناقة، والهدايا الفريدة في مكان واحد. استمتعي بتجربة تسوق
            استثنائية صُممت خصيصًا لتليق بكِ.
          </p>
        </div>
        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-5">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-7 border border-border/90 flex flex-col items-center text-center"
            >
              <div className="relative w-24 h-24 mb-6">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-foreground/80 leading-relaxed font-medium">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
