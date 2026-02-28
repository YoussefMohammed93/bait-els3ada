"use client";

import * as React from "react";
import { Users, Search } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaginatedQuery, useQuery } from "convex/react";
import { CustomersTable } from "@/components/dashboard/customers/customers-table";
import { CustomersStats } from "@/components/dashboard/customers/customers-stats";

const ITEMS_PER_PAGE = 8;

export default function CustomersPage() {
  const [search, setSearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch data
  const { results, status, loadMore } = usePaginatedQuery(
    api.customers.list,
    { search: debouncedSearch || undefined },
    { initialNumItems: ITEMS_PER_PAGE * currentPage },
  );

  const stats = useQuery(api.customers.getStats);
  const totalCount = useQuery(api.customers.count, {
    search: debouncedSearch || undefined,
  });

  const isLoading = status === "LoadingFirstPage";

  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalPages = Math.ceil((totalCount ?? 0) / ITEMS_PER_PAGE) || 1;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            إدارة العملاء
          </h2>
          <p className="text-muted-foreground font-medium">
            عرض وإدارة جميع العملاء المسجلين في متجرك.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <CustomersStats stats={stats} />

      {/* Filters */}
      <div className="relative group">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="ابحث بالاسم، البريد أو الهاتف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pr-11 pl-4 h-12 bg-white rounded-2xl focus:border-primary/30 focus:ring-primary/10 font-bold transition-all"
        />
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border/50 overflow-hidden bg-card">
          <div className="bg-muted/50 h-12" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-t flex gap-4 items-center">
              <Skeleton className="size-10 rounded-xl" />
              <Skeleton className="h-5 flex-1" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card/50 rounded-3xl border border-dashed border-border/50 text-center">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Users className="size-10 text-primary/40" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-1">
            {search ? "لا توجد نتائج مطابقة" : "لا يوجد عملاء حتى الآن"}
          </h3>
          <p className="text-muted-foreground max-w-sm font-medium">
            {search
              ? "جرّب البحث بكلمات مختلفة أو تأكد من الكتابة بشكل صحيح."
              : "عندما يبدأ العملاء بالتسجيل في متجرك، سيظهرون هنا."}
          </p>
          {search && (
            <Button
              onClick={() => setSearch("")}
              className="mt-6 rounded-xl font-bold"
            >
              إعادة تعيين البحث
            </Button>
          )}
        </div>
      ) : (
        <CustomersTable
          customers={paginatedResults}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            if (page > currentPage && status === "CanLoadMore") {
              loadMore(ITEMS_PER_PAGE);
            }
            setCurrentPage(page);
          }}
        />
      )}
    </div>
  );
}
