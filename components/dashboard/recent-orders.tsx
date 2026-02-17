export function RecentOrders() {
  const orders = [
    {
      id: "#8541",
      customer: "سارة أحمد",
      product: "مجموعة مكياج سهرة",
      amount: "1,200 ج.م",
      status: "مكتمل",
      statusColor: "bg-emerald-500/10 text-emerald-600",
    },
    {
      id: "#8542",
      customer: "منى علي",
      product: "إكسسوارات فضية",
      amount: "450 ج.م",
      status: "قيد التنفيذ",
      statusColor: "bg-blue-500/10 text-blue-600",
    },
    {
      id: "#8543",
      customer: "ليلى محمد",
      product: "هدية هاند ميد",
      amount: "750 ج.م",
      status: "جاري الشحن",
      statusColor: "bg-orange-500/10 text-orange-600",
    },
    {
      id: "#8544",
      customer: "فاطمة محمود",
      product: "شنطة مكياج",
      amount: "300 ج.م",
      status: "مكتمل",
      statusColor: "bg-emerald-500/10 text-emerald-600",
    },
    {
      id: "#8545",
      customer: "هند سعيد",
      product: "سلسلة ذهبية",
      amount: "900 ج.م",
      status: "ملغي",
      statusColor: "bg-rose-500/10 text-rose-600",
    },
  ];

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="text-lg font-bold">آخر الطلبات</h3>
        <a
          href="/dashboard/orders"
          className="text-xs text-primary font-medium hover:underline"
        >
          عرض الكل
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-bold min-w-[140px] sm:min-w-0">
                رقم الطلب
              </th>
              <th className="px-6 py-3 font-bold min-w-[200px] sm:min-w-0">
                العميل
              </th>
              <th className="px-6 py-3 font-bold min-w-[220px] sm:min-w-0">
                المنتج
              </th>
              <th className="px-6 py-3 font-bold min-w-[140px] sm:min-w-0">
                المبلغ
              </th>
              <th className="px-6 py-3 font-bold text-center min-w-[140px] sm:min-w-0">
                الحالة
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-6 py-4 font-bold text-primary min-w-[140px] sm:min-w-0">
                  {order.id}
                </td>
                <td className="px-6 py-4 font-bold min-w-[200px] sm:min-w-0">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-muted-foreground font-bold min-w-[220px] sm:min-w-0">
                  {order.product}
                </td>
                <td className="px-6 py-4 font-bold min-w-[140px] sm:min-w-0">
                  {order.amount}
                </td>
                <td className="px-6 py-4 min-w-[140px] sm:min-w-0">
                  <div className="flex justify-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.statusColor}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
