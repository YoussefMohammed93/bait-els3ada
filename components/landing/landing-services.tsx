import Image from "next/image";

const services = [
  {
    image: "/cosmetic-accessories.png",
    title: "ميكب و إكسسوارات",
    description:
      "تألقي بأحدث مستحضرات التجميل وأرقى الإكسسوارات التي تضفي لمسة من الجمال والجاذبية على إطلالتك",
    color: "bg-pink-500/10",
  },
  {
    image: "/giftbox.png",
    title: "هدايا",
    description:
      "هدايا مميزة لكل المناسبات مغلفة بأجمل الطرق عشان تفرحي اللي بتحبيهم بلمسة راقية مميزة",
    color: "bg-orange-500/10",
  },
  {
    image: "/handcraft.png",
    title: "هاند ميد",
    description:
      "جميع أنواع الطارات ومناديل كتب الكتاب وتوزيعات الأفراح والسبوع. تجهيزات كاملة للعرايس والمناسبات",
    color: "bg-rose-500/10",
  },
  {
    image: "/print.png",
    title: "طباعة حسب الطلب",
    description:
      "تتميز خدماتنا بالتنوع والجودة العالية: طباعة ديجيتال بطبقة حماية، طباعة حرارية، وحفر ليزر على المجات",
    color: "bg-sky-500/10",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20">
      <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-5">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            خدماتنا <span className="text-primary">المميزة</span>
          </h2>
          <p className="text-foreground/70 font-medium text-lg leading-relaxed">
            لأنكِ تستحقين التميز في كل تفصيلة، جمعنا لكِ عالمًا من الجمال،
            الأناقة، والهدايا الفريدة في مكان واحد. استمتعي بتجربة تسوق
            استثنائية صُممت خصيصًا لتليق بكِ.
          </p>
        </div>
        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-7 border border-border/50 flex flex-col items-center text-center hover:border-primary/50 transition-colors duration-300"
            >
              <div
                className={`relative w-[88px] h-[88px] mb-6 rounded-2xl ${service.color} flex items-center justify-center`}
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  width={60}
                  height={60}
                  className="object-contain"
                  sizes="60px"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-foreground/65 leading-relaxed font-medium text-[15px]">
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
