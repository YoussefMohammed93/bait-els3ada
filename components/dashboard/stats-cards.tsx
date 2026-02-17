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
  // In a real app, you would fetch data here based on month/year
  // For now, we'll just demonstrate the responsiveness to the prop

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="group relative rounded-3xl border bg-card p-6 transition-all duration-300"
        >
          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="size-6" />
            </div>
            <div
              className={`px-2 py-1 rounded-lg text-[10px] font-bold ${stat.trend.startsWith("+") ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}
            >
              {stat.trend}
            </div>
          </div>
          <div className="mt-6 space-y-1 relative z-10">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              {stat.title}
            </h3>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-foreground tabular-nums tracking-tighter">
                {stat.value}
              </p>
            </div>
            <p className="text-[11px] font-bold text-muted-foreground/80">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
