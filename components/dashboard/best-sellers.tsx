import Image from "next/image";

export function BestSellers() {
  const products = [
    {
      name: "مجموعة العناية بالبشرة رويال",
      category: "مكياج",
      sales: 124,
      image: "/cosmetic-accessories.png",
      price: "1500 ج.م",
    },
    {
      name: "خاتم وردة هاند ميد",
      category: "إكسسوارات",
      sales: 98,
      image: "/ring.png",
      price: "120 ج.م",
    },
    {
      name: "علبة هدايا مفاجآت",
      category: "هدايا",
      sales: 85,
      image: "/giftbox.png",
      price: "350 ج.م",
    },
    {
      name: "مج مطبوع حراري",
      category: "طباعة",
      sales: 76,
      image: "/print.png",
      price: "85 ج.م",
    },
    {
      name: "إسورة أنيقة",
      category: "إكسسوارات",
      sales: 64,
      image: "/ring.png",
      price: "95 ج.م",
    },
  ];

  return (
    <div className="rounded-2xl border bg-card shadow-sm h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-bold">المنتجات الأكثر مبيعاً</h3>
      </div>
      {/* Scrollable list on PC, Horizontal on Mobile */}
      <div className="flex-1 p-6 sm:space-y-6 flex sm:flex-col overflow-x-auto sm:overflow-x-hidden sm:overflow-y-auto gap-4 sm:gap-0 scrollbar-hide">
        {products.map((product, index) => (
          <div
            key={`${product.name}-${index}`}
            className="flex sm:flex-row flex-col items-center sm:items-center gap-4 group min-w-[160px] sm:min-w-0"
          >
            <div className="relative size-20 sm:size-14 rounded-xl bg-muted overflow-hidden flex-shrink-0 border items-center justify-center flex p-1">
              <Image
                src={product.image}
                alt={product.name}
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-right">
              <h4 className="font-bold text-sm truncate w-full">
                {product.name}
              </h4>
              <p className="text-xs text-muted-foreground font-bold">
                {product.category}
              </p>
            </div>
            <div className="text-center sm:text-right flex-shrink-0">
              <p className="text-sm font-bold text-primary">
                {product.sales} قطعة
              </p>
              <p className="text-[10px] text-muted-foreground font-bold">
                {product.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
