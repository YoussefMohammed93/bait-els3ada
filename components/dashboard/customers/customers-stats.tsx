import { Users, UserPlus, Zap } from "lucide-react";

interface CustomersStatsProps {
  stats?: {
    total: number;
    newThisMonth: number;
    activeEstimate: number;
  };
}

export function CustomersStats({ stats }: CustomersStatsProps) {
  const totalCustomers = stats?.total ?? 0;
  const newCustomers = stats?.newThisMonth ?? 0;
  const activeUsers = stats?.activeEstimate ?? 0;

  const statsItems = [
    {
      title: "إجمالي العملاء",
      value: totalCustomers.toString(),
      icon: Users,
      description: "جميع المسجلين",
      color: "text-blue-600",
      bg: "bg-blue-100/50",
    },
    {
      title: "نشط الآن",
      value: activeUsers.toString(),
      icon: Zap,
      description: "تقديري حالياً",
      color: "text-emerald-600",
      bg: "bg-emerald-100/50",
    },
    {
      title: "عملاء جدد",
      value: newCustomers.toString(),
      icon: UserPlus,
      description: "خلال هذا الشهر",
      color: "text-purple-600",
      bg: "bg-purple-100/50",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statsItems.map((stat) => (
        <div
          key={stat.title}
          className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20"
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
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs font-bold text-muted-foreground/60">
                  {stat.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
