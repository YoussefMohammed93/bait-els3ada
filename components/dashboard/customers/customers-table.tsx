"use client";

import {
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";

interface CustomersTableProps {
  customers: Doc<"users">[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CustomersTable({
  customers,
  currentPage,
  totalPages,
  onPageChange,
}: CustomersTableProps) {
  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm min-w-[800px]">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-bold w-[72px]">الصورة</th>
                <th className="px-5 py-3.5 font-bold">الاسم</th>
                <th className="px-5 py-3.5 font-bold">البريد الإلكتروني</th>
                <th className="px-5 py-3.5 font-bold">رقم الهاتف</th>
                <th className="px-5 py-3.5 font-bold">تاريخ الانضمام</th>
              </tr>
            </thead>
            <tbody className="divide-y border-t">
              {customers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <User className="size-5 text-primary/40" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-bold text-foreground">
                      {user.name || "بدون اسم"}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 text-muted-foreground font-medium">
                      <Mail className="size-3.5" />
                      {user.email || "---"}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 text-muted-foreground font-medium tabular-nums">
                      <Phone className="size-3.5" />
                      {user.phone || "---"}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground font-medium tabular-nums">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3.5" />
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("ar-EG")
                        : "---"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View */}
      <div className="md:hidden space-y-3">
        {customers.map((user) => (
          <div
            key={user._id}
            className="rounded-2xl border bg-card p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border shrink-0">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <User className="size-6 text-primary/40" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground truncate">
                  {user.name || "بدون اسم"}
                </p>
                <p className="text-xs text-muted-foreground truncate font-medium">
                  {user.email || "بدون بريد"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-3">
              <div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight block">
                  الهاتف
                </span>
                <span className="text-sm font-bold tabular-nums">
                  {user.phone || "---"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tight block">
                  انضم في
                </span>
                <span className="text-sm font-bold tabular-nums">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("ar-EG")
                    : "---"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-muted-foreground font-medium">
            صفحة {currentPage} من {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                className="size-8 rounded-lg text-xs font-bold"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-lg"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
