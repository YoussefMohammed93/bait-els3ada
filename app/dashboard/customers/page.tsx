"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CustomersTable,
  type Customer,
} from "@/components/dashboard/customers/customers-table";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import { CustomersFilters } from "@/components/dashboard/customers/customers-filters";
import { CustomersEmptyState } from "@/components/dashboard/customers/customers-empty-state";
import { CustomerDetailsModal } from "@/components/dashboard/customers/customer-details-modal";

const ITEMS_PER_PAGE = 8;

export default function CustomersPage() {
  // Filters
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("newest");

  // Data fetching
  const customers = useQuery(api.customers.list, { search, status, sortBy });
  const stats = useQuery(api.customers.getStats);

  // Pagination
  const [currentPage, setCurrentPage] = React.useState(1);

  // Modal
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null);

  // Reset pagination on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, status, sortBy]);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("all");
    setSortBy("newest");
  };

  const isLoading = customers === undefined || stats === undefined;

  // Pagination logic (client-side for now as the total result set is unlikely to be massive immediately)
  const totalPages = customers
    ? Math.ceil(customers.length / ITEMS_PER_PAGE)
    : 0;
  const paginatedCustomers = customers
    ? customers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      )
    : [];

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
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border bg-card p-5 h-[104px]">
              <div className="flex items-start gap-5">
                <Skeleton className="size-14 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-24" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
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
                      {stats.totalCustomers}
                    </p>
                    <p className="text-[11px] font-bold text-muted-foreground/60">
                      جميع العملاء
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
                      {stats.activeCustomers}
                    </p>
                    <p className="text-[11px] font-bold text-emerald-600/60">
                      طلبوا مؤخراً
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
                      {stats.inactiveCustomers}
                    </p>
                    <p className="text-[11px] font-bold text-orange-600/60">
                      لم يطلبوا منذ فترة
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:border-primary/20">
              <div className="flex items-start gap-5">
                <div className="p-3.5 rounded-2xl bg-violet-100/50 text-violet-600 shrink-0">
                  <UserPlus className="size-7" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-muted-foreground tracking-wide">
                    عملاء جدد
                  </h3>
                  <div className="flex items-end gap-2 my-1">
                    <p className="text-2xl font-bold text-foreground tabular-nums tracking-tight">
                      {stats.newThisMonth}
                    </p>
                    <p className="text-[11px] font-bold text-violet-600/60">
                      انضموا هذا الشهر
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filters */}
      <CustomersFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sortBy={sortBy}
        onReset={handleResetFilters}
        onSortChange={setSortBy}
      />

      {/* Results count */}
      <div className="flex items-center justify-between px-1">
        {isLoading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          <p className="text-sm text-muted-foreground font-medium">
            عرض{" "}
            <span className="font-bold text-foreground">
              {customers.length}
            </span>{" "}
            عميل
          </p>
        )}
      </div>

      {/* Table / Empty State */}
      {isLoading ? (
        <div className="rounded-2xl border bg-card overflow-hidden">
          <div className="p-5 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      ) : customers.length > 0 ? (
        <CustomersTable
          customers={paginatedCustomers as Customer[]}
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
