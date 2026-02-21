"use client";

import * as React from "react";
import {
  CustomersTable,
  type Customer,
} from "@/components/dashboard/customers/customers-table";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import { CustomersFilters } from "@/components/dashboard/customers/customers-filters";
import { CustomersEmptyState } from "@/components/dashboard/customers/customers-empty-state";
import { CustomerDetailsModal } from "@/components/dashboard/customers/customer-details-modal";

// ── Mock Data ──
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "سارة أحمد",
    phone: "01012345678",
    email: "sara.ahmed@email.com",
    address: "الدقهلية، شربين، شارع البحر",
    totalOrders: 12,
    totalSpent: 8540,
    status: "نشط",
    joinDate: "2025-08-15",
    lastOrderDate: "2026-02-20",
  },
  {
    id: "2",
    name: "منى علي",
    phone: "01234567890",
    email: "mona.ali@email.com",
    address: "القاهرة، المعادي، شارع 9",
    totalOrders: 8,
    totalSpent: 5230,
    status: "نشط",
    joinDate: "2025-09-02",
    lastOrderDate: "2026-02-18",
  },
  {
    id: "3",
    name: "ليلى محمد",
    phone: "01122334455",
    email: "laila.m@email.com",
    address: "الإسكندرية، سموحة، طريق الحرية",
    totalOrders: 5,
    totalSpent: 3100,
    status: "نشط",
    joinDate: "2025-10-20",
    lastOrderDate: "2026-02-15",
  },
  {
    id: "4",
    name: "فاطمة محمود",
    phone: "01098765432",
    email: "fatma.m@email.com",
    address: "المنصورة، المشاية السفلية",
    totalOrders: 3,
    totalSpent: 1870,
    status: "نشط",
    joinDate: "2025-11-10",
    lastOrderDate: "2026-02-12",
  },
  {
    id: "5",
    name: "هند سعيد",
    phone: "01234567891",
    email: "hend.said@email.com",
    address: "طنطا، شارع البحر",
    totalOrders: 1,
    totalSpent: 450,
    status: "غير نشط",
    joinDate: "2025-12-01",
    lastOrderDate: "2025-12-15",
  },
  {
    id: "6",
    name: "نورا خالد",
    phone: "01011223344",
    email: "noura.k@email.com",
    address: "دمياط، ميدان الساعة",
    totalOrders: 15,
    totalSpent: 12300,
    status: "نشط",
    joinDate: "2025-06-20",
    lastOrderDate: "2026-02-19",
  },
  {
    id: "7",
    name: "ريم حسن",
    phone: "01288776655",
    email: "reem.h@email.com",
    address: "بورسعيد، حي الشرق",
    totalOrders: 7,
    totalSpent: 4980,
    status: "نشط",
    joinDate: "2025-07-15",
    lastOrderDate: "2026-02-10",
  },
  {
    id: "8",
    name: "ياسمين عبدالله",
    phone: "01144556677",
    email: "yasmin.a@email.com",
    address: "الجيزة، المهندسين",
    totalOrders: 2,
    totalSpent: 980,
    status: "غير نشط",
    joinDate: "2025-11-25",
    lastOrderDate: "2026-01-05",
  },
  {
    id: "9",
    name: "أمل طارق",
    phone: "01555443322",
    email: "amal.t@email.com",
    address: "الإسماعيلية، حي أول",
    totalOrders: 9,
    totalSpent: 6750,
    status: "نشط",
    joinDate: "2025-08-01",
    lastOrderDate: "2026-02-17",
  },
  {
    id: "10",
    name: "دعاء إبراهيم",
    phone: "01200112233",
    email: "doaa.i@email.com",
    address: "أسيوط، شارع الجمهورية",
    totalOrders: 4,
    totalSpent: 2340,
    status: "نشط",
    joinDate: "2025-10-05",
    lastOrderDate: "2026-02-08",
  },
  {
    id: "11",
    name: "مريم يوسف",
    phone: "01066778899",
    email: "mariam.y@email.com",
    address: "الفيوم، حي البحيرة",
    totalOrders: 1,
    totalSpent: 320,
    status: "غير نشط",
    joinDate: "2026-01-10",
    lastOrderDate: "2026-01-10",
  },
  {
    id: "12",
    name: "جنا كريم",
    phone: "01188990011",
    email: "jana.k@email.com",
    address: "سوهاج، شارع الجامعة",
    totalOrders: 6,
    totalSpent: 3890,
    status: "نشط",
    joinDate: "2025-09-18",
    lastOrderDate: "2026-02-14",
  },
  {
    id: "13",
    name: "لمياء فؤاد",
    phone: "01044332211",
    email: "lamiaa.f@email.com",
    address: "المنيا، شارع عدنان المالكي",
    totalOrders: 11,
    totalSpent: 9200,
    status: "نشط",
    joinDate: "2025-07-01",
    lastOrderDate: "2026-02-16",
  },
  {
    id: "14",
    name: "شيماء وليد",
    phone: "01233445566",
    email: "shimaa.w@email.com",
    address: "البحيرة، دمنهور",
    totalOrders: 2,
    totalSpent: 780,
    status: "غير نشط",
    joinDate: "2025-12-20",
    lastOrderDate: "2026-01-02",
  },
  {
    id: "15",
    name: "رانيا سمير",
    phone: "01099887766",
    email: "rania.s@email.com",
    address: "كفر الشيخ، شارع النبوي المهندس",
    totalOrders: 18,
    totalSpent: 15600,
    status: "نشط",
    joinDate: "2025-05-10",
    lastOrderDate: "2026-02-21",
  },
];

const ITEMS_PER_PAGE = 8;

export default function CustomersPage() {
  const [customers] = React.useState<Customer[]>(mockCustomers);

  // Filters
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);

  // Modal
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null);

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, status, sortBy]);

  // ── Filter & Sort ──
  const filteredCustomers = React.useMemo(() => {
    let result = [...customers];

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q),
      );
    }

    // Status filter
    if (status !== "all") {
      result = result.filter((c) => c.status === status);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
        );
        break;
      case "orders-high":
        result.sort((a, b) => b.totalOrders - a.totalOrders);
        break;
      case "spend-high":
        result.sort((a, b) => b.totalSpent - a.totalSpent);
        break;
    }

    return result;
  }, [customers, search, status, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setSortBy("newest");
  };

  // Stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "نشط").length;
  const inactiveCustomers = customers.filter(
    (c) => c.status === "غير نشط",
  ).length;
  const newThisMonth = customers.filter((c) => {
    const joinDate = new Date(c.joinDate);
    const now = new Date();
    return (
      joinDate.getMonth() === now.getMonth() &&
      joinDate.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            إدارة العملاء
          </h2>
          <p className="text-muted-foreground font-medium">
            تابعي وأديري بيانات جميع العملاء وسجلاتهم من هنا.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total Customers */}
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-blue-100/50 text-blue-600 shrink-0">
              <Users className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide">
                إجمالي العملاء
              </h3>
              <div className="flex items-end gap-2 my-1">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {totalCustomers}
                </p>
                <p className="text-[11px] font-bold text-muted-foreground/60">
                  جميع العملاء المسجلين
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Customers */}
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-emerald-100/50 text-emerald-600 shrink-0">
              <UserCheck className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide">
                عملاء نشطين
              </h3>
              <div className="flex items-end gap-2 my-1">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {activeCustomers}
                </p>
                <p className="text-[11px] font-bold text-emerald-600/60">
                  لديهم طلبات حديثة
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Inactive Customers */}
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-orange-100/50 text-orange-600 shrink-0">
              <UserX className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide">
                عملاء غير نشطين
              </h3>
              <div className="flex items-end gap-2 my-1">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {inactiveCustomers}
                </p>
                <p className="text-[11px] font-bold text-orange-600/60">
                  لم يطلبوا مؤخراً
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* New This Month */}
        <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
          <div className="flex items-start gap-5">
            <div className="p-3.5 rounded-2xl bg-violet-100/50 text-violet-600 shrink-0">
              <UserPlus className="size-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-muted-foreground tracking-wide">
                عملاء جدد هذا الشهر
              </h3>
              <div className="flex items-end gap-2 my-1">
                <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                  {newThisMonth}
                </p>
                <p className="text-[11px] font-bold text-violet-600/60">
                  انضموا هذا الشهر
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <CustomersFilters
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
            {filteredCustomers.length}
          </span>{" "}
          عميل
        </p>
      </div>

      {/* Table / Empty State */}
      {filteredCustomers.length > 0 ? (
        <CustomersTable
          customers={paginatedCustomers}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onViewDetails={setSelectedCustomer}
        />
      ) : (
        <CustomersEmptyState
          isFiltering={!!search.trim() || status !== "all"}
          onReset={handleResetFilters}
        />
      )}

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        open={!!selectedCustomer}
        onOpenChange={(open) => !open && setSelectedCustomer(null)}
        customer={selectedCustomer}
      />
    </div>
  );
}
