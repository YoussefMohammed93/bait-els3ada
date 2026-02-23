import { mutation } from "./_generated/server";

const PRODUCT_DATA = [
  {
    name: "طقم أواني طهي جرانيت",
    description:
      "طقم أواني طهي عالي الجودة مكون من 10 قطع، غير لاصق وسهل التنظيف.",
    category: "مطبخ",
  },
  {
    name: "أباجورة مودرن",
    description: "أباجورة بتصميم عصري تضفي لمسة من الأناقة على غرفتك.",
    category: "إضاءة",
  },
  {
    name: "طقم مفرش سرير قطن",
    description: "مفرش سرير قطني ناعم ومريح متوفر بألوان جذابة.",
    category: "مفروشات",
  },
  {
    name: "كنبة ركنة مريحة",
    description: "كنبة ركنة بتصميم عصري وقماش عالي الجودة.",
    category: "أثاث",
  },
  {
    name: "ساعة حائط كلاسيك",
    description: "ساعة حائط بتصميم خشبي كلاسيكي رائع.",
    category: "ديكور",
  },
  {
    name: "طقم سكاكين احترافي",
    description: "طقم سكاكين مطبخ حادة وشفرات من الفولاذ المقاوم للصدأ.",
    category: "مطبخ",
  },
  {
    name: "رفوف تعليق جدارية",
    description: "مجموعة من 3 رفوف خشبية لتنظيم أغراضك بلمسة جمالية.",
    category: "ديكور",
  },
  {
    name: "كرسي مكتب مريح",
    description: "كرسي مكتب مريح يدعم الظهر لساعات عمل طويلة.",
    category: "أثاث",
  },
  {
    name: "طقم أكواب كريستال",
    description: "طقم 6 أكواب كريستال فاخرة للمناسبات الخاصة.",
    category: "مطبخ",
  },
  {
    name: "سجادة غرفة معيشة",
    description: "سجادة ناعمة بتصاميم هندسية عصرية.",
    category: "ديكور",
  },
  {
    name: "لوحة جدارية فنية",
    description: "لوحة زيتية يدوية بإطارات خشبية فاخرة.",
    category: "ديكور",
  },
  {
    name: "مكتب خشبي بسيط",
    description: "مكتب بتصميم بسيط وعملي يناسب المساحات الصغيرة.",
    category: "أثاث",
  },
  {
    name: "طقم مائدة طعام",
    description: "طقم مائدة طعام بورسلين فاخر لـ 6 أشخاص.",
    category: "مطبخ",
  },
  {
    name: "طاولة قهوة مودرن",
    description: "طاولة قهوة بسطح زجاجي وتصميم فخم.",
    category: "أثاث",
  },
  {
    name: "وسادة طبية مريحة",
    description: "وسادة ميموري فوم توفر الراحة التامة للرقبة.",
    category: "مفروشات",
  },
  {
    name: "مرآة حائط كبيرة",
    description: "مرآة حائط بتصميم أنيق تزيد من مساحة الغرفة.",
    category: "ديكور",
  },
  {
    name: "صندوق تخزين خشبي",
    description: "صندوق تخزين يدوي الصنع بلمسة تراثية.",
    category: "ديكور",
  },
  {
    name: "منظم مطبخ ذكي",
    description: "منظم لتوفير المساحة وتنظيم التوابل والأدوات.",
    category: "مطبخ",
  },
  {
    name: "ستارة غرفة نوم",
    description: "ستارة عازلة للضوء بتصاميم وألوان هادئة.",
    category: "مفروشات",
  },
  {
    name: "عجالة مطبخ كهربائية",
    description: "خلاط وعجانة قوية لسعة عالية ونتائج ممتازة.",
    category: "مطبخ",
  },
];

const IMAGES = [
  "https://images.unsplash.com/photo-1583847268964-b28dc2f51f92",
  "https://images.unsplash.com/photo-1556911220-e150213ff1a3",
  "https://images.unsplash.com/photo-1544457070-4cd9c5ad699a",
  "https://images.unsplash.com/photo-1513519245088-0e12902e35ca",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
  "https://images.unsplash.com/photo-1567016432779-094069958ea5",
  "https://images.unsplash.com/photo-1505691938895-1758d7eaa511",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
  "https://images.unsplash.com/photo-1554034483-04fda0d3507b",
];

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Ensure categories exist
    const existingCategories = await ctx.db.query("categories").collect();
    const categoryNames = existingCategories.map((c) => c.name);

    const neededCategories = Array.from(
      new Set(PRODUCT_DATA.map((p) => p.category)),
    );

    for (const catName of neededCategories) {
      if (!categoryNames.includes(catName)) {
        await ctx.db.insert("categories", {
          name: catName,
          slug: catName.toLowerCase().replace(/\s+/g, "-"),
          image: IMAGES[Math.floor(Math.random() * IMAGES.length)],
        });
      }
    }

    // 2. Insert Products
    for (let i = 0; i < PRODUCT_DATA.length; i++) {
      const p = PRODUCT_DATA[i];
      const stock = Math.floor(Math.random() * 90) + 10;
      const status =
        stock === 0 ? "غير متوفر" : stock <= 5 ? "كمية قليلة" : "متوفر";

      await ctx.db.insert("products", {
        name: p.name,
        description: p.description,
        category: p.category,
        price: Math.floor(Math.random() * 4900) + 100,
        stock,
        image: IMAGES[Math.floor(Math.random() * IMAGES.length)],
        images: [
          IMAGES[Math.floor(Math.random() * IMAGES.length)],
          IMAGES[Math.floor(Math.random() * IMAGES.length)],
        ],
        status,
        dateAdded: new Date().toISOString().split("T")[0],
        isCodAvailable: true,
      });
    }

    return { success: true, count: PRODUCT_DATA.length };
  },
});

export const clearAllProductData = mutation({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    for (const p of products) {
      await ctx.db.delete(p._id);
    }
    return { success: true, count: products.length };
  },
});
