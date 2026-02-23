"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  OrdersTable,
  type Order,
} from "@/components/dashboard/orders/orders-table";
import {
  ShoppingCart,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";
import { OrdersFilters } from "@/components/dashboard/orders/orders-filters";
import { OrdersEmptyState } from "@/components/dashboard/orders/orders-empty-state";
import { OrderDetailsModal } from "@/components/dashboard/orders/order-details-modal";

const ITEMS_PER_PAGE = 8;

const backendToFrontendStatus: Record<
  string,
  "مكتمل" | "قيد التنفيذ" | "جاري الشحن" | "ملغي" | "قيد الانتظار"
> = {
  pending: "قيد الانتظار",
  processing: "قيد التنفيذ",
  shipped: "جاري الشحن",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export default function OrdersPage() {
  const convexOrders = useQuery(api.orders.getAllOrders);

  // Filters
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);

  // Modal
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  // Transform Convex data to frontend Order type
  const orders = React.useMemo(() => {
    if (!convexOrders) return [];
    return convexOrders.map((o) => ({
      id: `#${o._id.toString().slice(-4).toUpperCase()}`,
      _id: o._id,
      customer: o.customerName,
      phone: o.phone,
      address: `${o.governorate}، ${o.address}`,
      amount: o.totalAmount,
      status: backendToFrontendStatus[o.status] || "قيد الانتظار",
      paymentMethod:
        o.paymentMethod === "cod" ? "الدفع عند الاستلام" : "فودافون كاش",
      senderWallet: o.senderWallet,
      date: new Date(o.createdAt).toISOString().split("T")[0],
      products: o.items.map(
        (item: {
          productName: string;
          productImage?: string;
          price: number;
          quantity: number;
        }) => ({
          name: item.productName,
          image: item.productImage || "/placeholder.png",
          price: item.price,
          quantity: item.quantity,
        }),
      ),
    })) as Order[];
  }, [convexOrders]);

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

  if (convexOrders === undefined) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // Stats
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "مكتمل").length;
  const pendingOrders = orders.filter(
    (o) => o.status === "قيد الانتظار" || o.status === "قيد التنفيذ",
  ).length;
  const cancelledOrders = orders.filter((o) => o.status === "ملغي").length;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1 text-right" dir="rtl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            إدارة الطلبات
          </h2>
          <p className="text-muted-foreground font-medium">
            تابعي ونظّمي جميع طلبات العملاء من هنا.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" dir="rtl">
        {/* Total Orders */}
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-blue-100/50 text-blue-600 shrink-0">
              <ShoppingCart className="size-7" />
            </div>
            <div className="min-w-0 text-right">
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
            <div className="min-w-0 text-right">
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
            <div className="min-w-0 text-right">
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
            <div className="min-w-0 text-right">
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
      <div className="flex items-center justify-between px-1" dir="rtl">
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
        <OrdersEmptyState
          isFiltering={!!search.trim() || status !== "all"}
          onReset={handleResetFilters}
        />
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
