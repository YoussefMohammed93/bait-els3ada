import { Package, ShoppingCart, TrendingUp, Users } from "lucide-react";

interface StatsCardsProps {
  month?: string;
  year?: string;
}

const stats = [
  {
    title: "إجمالي المنتجات",
    value: "148",
    icon: Package,
    trend: "+5.2%",
    description: "منتج متاح حالياً",
    color: "text-blue-600",
    bg: "bg-blue-100/50",
  },
  {
    title: "إجمالي الطلبات",
    value: "1,240",
    icon: ShoppingCart,
    trend: "+12.1%",
    description: "طلب خلال هذا الشهر",
    color: "text-orange-600",
    bg: "bg-orange-100/50",
  },
  {
    title: "إجمالي الإيرادات",
    value: "45,210 ج.م",
    icon: TrendingUp,
    trend: "+8.4%",
    description: "زيادة عن الشهر الماضي",
    color: "text-emerald-600",
    bg: "bg-emerald-100/50",
  },
  {
    title: "إجمالي العملاء",
    value: "850",
    icon: Users,
    trend: "+2.5%",
    description: "عميل نشط",
    color: "text-purple-600",
    bg: "bg-purple-100/50",
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function StatsCards({ month, year }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="group relative rounded-3xl border bg-card p-5 transition-all duration-300 hover:border-primary/20"
        >
          <div className="flex items-start gap-5">
            <div
              className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} shrink-0`}
            >
              <stat.icon className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide truncate">
                {stat.title}
              </h3>
              <div className="flex items-baseline gap-2 my-1">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {stat.value}
                </p>
              </div>
              <p className="text-[11px] font-bold text-muted-foreground/60 whitespace-nowrap">
                {stat.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
