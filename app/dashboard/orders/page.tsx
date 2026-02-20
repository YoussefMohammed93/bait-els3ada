"use client";

import * as React from "react";
import {
  OrdersTable,
  type Order,
} from "@/components/dashboard/orders/orders-table";
import { ShoppingCart, CheckCircle2, Clock, XCircle } from "lucide-react";
import { OrdersFilters } from "@/components/dashboard/orders/orders-filters";
import { OrdersEmptyState } from "@/components/dashboard/orders/orders-empty-state";
import { OrderDetailsModal } from "@/components/dashboard/orders/order-details-modal";

// ── Mock Data ──
const mockOrders: Order[] = [
  {
    id: "#8541",
    customer: "سارة أحمد",
    phone: "01012345678",
    address: "الدقهلية، شربين، شارع البحر",
    products: [
      {
        name: "مجموعة مكياج سهرة فاخرة",
        image: "/cosmetic-accessories.png",
        price: 1200,
        quantity: 1,
      },
      {
        name: "كريم مرطب طبيعي",
        image: "/handcraft.png",
        price: 350,
        quantity: 1,
      },
    ],
    amount: 1550,
    status: "مكتمل",
    paymentMethod: "بطاقة ائتمان",
    date: "2026-02-20",
  },
  {
    id: "#8542",
    customer: "منى علي",
    phone: "01234567890",
    address: "القاهرة، المعادي، شارع 9",
    products: [
      {
        name: "سلسلة فضية مع قلب",
        image: "/ring.png",
        price: 450,
        quantity: 1,
      },
    ],
    amount: 450,
    status: "قيد التنفيذ",
    paymentMethod: "الدفع عند الاستلام",
    date: "2026-02-19",
  },
  {
    id: "#8543",
    customer: "ليلى محمد",
    phone: "01122334455",
    address: "الإسكندرية، سموحة، طريق الحرية",
    products: [
      {
        name: "بوكس هدية عيد الحب",
        image: "/giftbox.png",
        price: 550,
        quantity: 1,
      },
      {
        name: "شنطة مكياج جلدية",
        image: "/handcraft.png",
        price: 680,
        quantity: 1,
      },
    ],
    amount: 1230,
    status: "جاري الشحن",
    paymentMethod: "تحويل بنكي",
    date: "2026-02-18",
  },
  {
    id: "#8544",
    customer: "فاطمة محمود",
    phone: "01098765432",
    address: "المنصورة، المشاية السفلية",
    products: [
      {
        name: "شنطة كروس صغيرة",
        image: "/handcraft.png",
        price: 320,
        quantity: 1,
      },
    ],
    amount: 320,
    status: "مكتمل",
    paymentMethod: "بطاقة ائتمان",
    date: "2026-02-17",
  },
  {
    id: "#8545",
    customer: "هند سعيد",
    phone: "01234567891",
    address: "طنطا، شارع البحر",
    products: [
      { name: "عطر زهور الربيع", image: "/ring.png", price: 890, quantity: 1 },
      {
        name: "سيروم فيتامين سي",
        image: "/cosmetic-accessories.png",
        price: 420,
        quantity: 1,
      },
    ],
    amount: 1310,
    status: "ملغي",
    paymentMethod: "الدفع عند الاستلام",
    date: "2026-02-16",
  },
  {
    id: "#8546",
    customer: "نورا خالد",
    phone: "01011223344",
    address: "دمياط، ميدان الساعة",
    products: [
      { name: "أحمر شفاه مطفي", image: "/print.png", price: 180, quantity: 1 },
      {
        name: "كريم مرطب طبيعي",
        image: "/handcraft.png",
        price: 350,
        quantity: 1,
      },
    ],
    amount: 530,
    status: "مكتمل",
    paymentMethod: "فودافون كاش",
    date: "2026-02-15",
  },
  {
    id: "#8547",
    customer: "ريم حسن",
    phone: "01288776655",
    address: "بورسعيد، حي الشرق",
    products: [
      {
        name: "مجموعة مكياج سهرة فاخرة",
        image: "/cosmetic-accessories.png",
        price: 1200,
        quantity: 1,
      },
    ],
    amount: 1200,
    status: "قيد التنفيذ",
    paymentMethod: "بطاقة ائتمان",
    date: "2026-02-14",
  },
  {
    id: "#8548",
    customer: "ياسمين عبدالله",
    phone: "01144556677",
    address: "الجيزة، المهندسين",
    products: [
      {
        name: "أسوارة ذهبية مرصعة",
        image: "/ring.png",
        price: 750,
        quantity: 1,
      },
      {
        name: "سلسلة فضية مع قلب",
        image: "/ring.png",
        price: 450,
        quantity: 1,
      },
    ],
    amount: 1200,
    status: "جاري الشحن",
    paymentMethod: "تحويل بنكي",
    date: "2026-02-13",
  },
  {
    id: "#8549",
    customer: "أمل طارق",
    phone: "01555443322",
    address: "الإسماعيلية، حي أول",
    products: [
      {
        name: "شنطة مكياج جلدية",
        image: "/handcraft.png",
        price: 680,
        quantity: 1,
      },
    ],
    amount: 680,
    status: "مكتمل",
    paymentMethod: "الدفع عند الاستلام",
    date: "2026-02-12",
  },
  {
    id: "#8550",
    customer: "دعاء إبراهيم",
    phone: "01200112233",
    address: "أسيوط، شارع الجمهورية",
    products: [
      {
        name: "بوكس هدية عيد الحب",
        image: "/giftbox.png",
        price: 550,
        quantity: 1,
      },
      { name: "عطر زهور الربيع", image: "/ring.png", price: 890, quantity: 1 },
    ],
    amount: 1440,
    status: "مكتمل",
    paymentMethod: "فودافون كاش",
    date: "2026-02-11",
  },
  {
    id: "#8551",
    customer: "مريم يوسف",
    phone: "01066778899",
    address: "الفيوم، حي البحيرة",
    products: [
      {
        name: "سيروم فيتامين سي",
        image: "/cosmetic-accessories.png",
        price: 420,
        quantity: 1,
      },
    ],
    amount: 420,
    status: "ملغي",
    paymentMethod: "بطاقة ائتمان",
    date: "2026-02-10",
  },
  {
    id: "#8552",
    customer: "جنا كريم",
    phone: "01188990011",
    address: "سوهج، شارع الجامعة",
    products: [
      { name: "أحمر شفاه مطفي", image: "/print.png", price: 180, quantity: 1 },
      {
        name: "شنطة كروس صغيرة",
        image: "/handcraft.png",
        price: 320,
        quantity: 1,
      },
    ],
    amount: 500,
    status: "قيد التنفيذ",
    paymentMethod: "الدفع عند الاستلام",
    date: "2026-02-09",
  },
  {
    id: "#8553",
    customer: "لمياء فؤاد",
    phone: "01044332211",
    address: "المنيا، شارع عدنان المالكي",
    products: [
      {
        name: "مجموعة مكياج سهرة فاخرة",
        image: "/cosmetic-accessories.png",
        price: 1200,
        quantity: 1,
      },
      {
        name: "أسوارة ذهبية مرصعة",
        image: "/ring.png",
        price: 750,
        quantity: 1,
      },
    ],
    amount: 1950,
    status: "مكتمل",
    paymentMethod: "بطاقة ائتمان",
    date: "2026-02-08",
  },
  {
    id: "#8554",
    customer: "شيماء وليد",
    phone: "01233445566",
    address: "البحيرة، دمنهور",
    products: [
      {
        name: "كريم مرطب طبيعي",
        image: "/handcraft.png",
        price: 350,
        quantity: 1,
      },
    ],
    amount: 350,
    status: "جاري الشحن",
    paymentMethod: "تحويل بنكي",
    date: "2026-02-07",
  },
  {
    id: "#8555",
    customer: "رانيا سمير",
    phone: "01099887766",
    address: "كفر الشيخ، شارع النبوي المهندس",
    products: [
      { name: "عطر زهور الربيع", image: "/ring.png", price: 890, quantity: 1 },
      {
        name: "بوكس هدية عيد الحب",
        image: "/giftbox.png",
        price: 550,
        quantity: 1,
      },
      {
        name: "شنطة مكياج جلدية",
        image: "/handcraft.png",
        price: 680,
        quantity: 1,
      },
    ],
    amount: 2120,
    status: "مكتمل",
    paymentMethod: "فودافون كاش",
    date: "2026-02-06",
  },
];

const ITEMS_PER_PAGE = 8;

export default function OrdersPage() {
  const [orders] = React.useState<Order[]>(mockOrders);

  // Filters
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);

  // Modal
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, status, sortBy]);

  // ── Filter & Sort ──
  const filteredOrders = React.useMemo(() => {
    let result = [...orders];

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.products.some((p) => p.name.toLowerCase().includes(q)),
      );
    }

    // Status filter
    if (status !== "all") {
      result = result.filter((o) => o.status === status);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        break;
      case "amount-high":
        result.sort((a, b) => b.amount - a.amount);
        break;
      case "amount-low":
        result.sort((a, b) => a.amount - b.amount);
        break;
    }

    return result;
  }, [orders, search, status, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setSortBy("newest");
  };

  // Stats
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "مكتمل").length;
  const pendingOrders = orders.filter((o) => o.status === "قيد التنفيذ").length;
  const cancelledOrders = orders.filter((o) => o.status === "ملغي").length;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            إدارة الطلبات
          </h2>
          <p className="text-muted-foreground font-medium">
            تابعي ونظّمي جميع طلبات العملاء من هنا.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Orders */}
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-blue-100/50 text-blue-600 shrink-0">
              <ShoppingCart className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide">
                إجمالي الطلبات
              </h3>
              <div className="flex items-end gap-2 my-1">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {totalOrders}
                </p>
                <p className="text-[11px] font-bold text-muted-foreground/60">
                  جميع الطلبات المسجلة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-emerald-100/50 text-emerald-600 shrink-0">
              <CheckCircle2 className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide">
                طلبات مكتملة
              </h3>
              <div className="flex items-end gap-2 my-1">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {completedOrders}
                </p>
                <p className="text-[11px] font-bold text-emerald-600/60">
                  تم التسليم بنجاح
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-orange-100/50 text-orange-600 shrink-0">
              <Clock className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide">
                قيد التنفيذ
              </h3>
              <div className="flex items-end gap-2 my-1">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {pendingOrders}
                </p>
                <p className="text-[11px] font-bold text-orange-600/60">
                  بانتظار المعالجة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cancelled */}
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-destructive/10 text-destructive shrink-0">
              <XCircle className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide">
                طلبات ملغية
              </h3>
              <div className="flex items-end gap-2 my-1">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {cancelledOrders}
                </p>
                <p className="text-[11px] font-bold text-destructive">
                  تم إلغاؤها
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <OrdersFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={handleResetFilters}
      />

      {/* Results count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-sm text-muted-foreground font-medium">
          عرض{" "}
          <span className="font-bold text-foreground">
            {filteredOrders.length}
          </span>{" "}
          طلب
        </p>
      </div>

      {/* Table / Empty State */}
      {filteredOrders.length > 0 ? (
        <OrdersTable
          orders={paginatedOrders}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onViewDetails={setSelectedOrder}
        />
      ) : (
        <OrdersEmptyState />
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        order={selectedOrder}
      />
    </div>
  );
}
