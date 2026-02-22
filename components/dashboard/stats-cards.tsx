import {
  Package,
  ShoppingCart,
  TrendingDown,
  MoveHorizontal,
  Users,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  month: string;
  year: string;
  isPast?: boolean;
  isCurrent?: boolean;
  isFuture?: boolean;
}

export function StatsCards({
  month,
  year,
  isPast,
  isCurrent,
  isFuture,
}: StatsCardsProps) {
  const statsData = useQuery(api.dashboard.getStats, { month, year });

  if (!statsData) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-3xl border bg-card p-5 h-[104px]">
            <div className="flex items-start gap-5">
              <Skeleton className="size-14 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "إجمالي المنتجات",
      value: statsData.totalProducts.value,
      icon: Package,
      trend: statsData.totalProducts.trend,
      description: isCurrent
        ? statsData.totalProducts.description
        : isPast
          ? "إجمالي المنتجات في ذلك الوقت"
          : isFuture
            ? "المنتجات المتوقع توفرها"
            : statsData.totalProducts.description,
      color: "text-blue-600",
      bg: "bg-blue-100/50",
    },
    {
      title: "إجمالي الطلبات",
      value: statsData.totalOrders.value,
      icon: ShoppingCart,
      trend: statsData.totalOrders.trend,
      description: isCurrent
        ? statsData.totalOrders.description
        : isPast
          ? "إجمالي طلبات الشهر المنتهي"
          : isFuture
            ? "طلبات متوقعة"
            : statsData.totalOrders.description,
      color: "text-orange-600",
      bg: "bg-orange-100/50",
    },
    {
      title: "إجمالي الإيرادات",
      value: statsData.totalRevenue.value,
      icon: CircleDollarSign,
      trend: statsData.totalRevenue.trend,
      description: isCurrent
        ? statsData.totalRevenue.description
        : isPast
          ? "إجمالي إيرادات الشهر النهائية"
          : isFuture
            ? "إيرادات متوقعة"
            : statsData.totalRevenue.description,
      color: "text-emerald-600",
      bg: "bg-emerald-100/50",
    },
    {
      title: "إجمالي العملاء",
      value: statsData.totalCustomers.value,
      icon: Users,
      trend: statsData.totalCustomers.trend,
      description: isCurrent
        ? statsData.totalCustomers.description
        : isPast
          ? "العملاء الذين زاروا المتجر"
          : isFuture
            ? "عملاء مستهدفون"
            : statsData.totalCustomers.description,
      color: "text-purple-600",
      bg: "bg-purple-100/50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const trendType = stat.trend.type;
        const trendValue = stat.trend.value;
        const TrendIcon =
          trendType === "up"
            ? TrendingUp
            : trendType === "down"
              ? TrendingDown
              : MoveHorizontal;
        const trendColor =
          trendType === "up"
            ? "text-emerald-600 bg-emerald-50"
            : trendType === "down"
              ? "text-rose-600 bg-rose-50"
              : "text-amber-600 bg-amber-50";

        return (
          <div
            key={stat.title}
            className="group relative rounded-3xl border bg-card p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-sm"
          >
            <div className="flex items-start gap-5">
              <div
                className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} shrink-0`}
              >
                <stat.icon className="size-7" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-muted-foreground tracking-wide truncate">
                    {stat.title}
                  </h3>
                  {trendValue !== "0%" && (
                    <div
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[10px] font-bold ${trendColor}`}
                    >
                      <TrendIcon className="size-3" />
                      <span>{trendValue}</span>
                    </div>
                  )}
                  {trendValue === "0%" &&
                    trendType === "neutral" &&
                    stat.title !== "إجمالي المنتجات" && (
                      <div
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[10px] font-bold ${trendColor}`}
                      >
                        <TrendIcon className="size-3" />
                      </div>
                    )}
                </div>
                <div className="flex items-baseline gap-2 my-1">
                  <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                    {stat.value}
                  </p>
                </div>
                <p className="text-[11px] font-bold text-muted-foreground/60">
                  {stat.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
