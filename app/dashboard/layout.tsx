"use client";

import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
import NextImage from "next/image";
import { User } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AdminGuard } from "@/components/auth/admin-guard";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useQuery(api.users.currentUser);

  return (
    <AdminGuard>
      <SidebarProvider defaultOpen={true}>
        <div
          className="flex min-h-svh w-full bg-background font-tajawal"
          dir="rtl"
        >
          <DashboardSidebar side="right" />
          <SidebarInset className="flex flex-col min-w-0">
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <div className="h-4 w-px bg-border mx-1" />
                <h1 className="text-sm font-semibold text-foreground">
                  لوحة التحكم
                </h1>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold leading-none">
                    {user?.name || user?.email || "مدير النظام"}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {user?.userRole === "admin" ? "مدير النظام" : "مستخدم"}
                  </span>
                </div>
                <div className="relative size-10 rounded-full bg-accent flex items-center justify-center overflow-hidden border">
                  {user?.image ? (
                    <NextImage
                      src={user.image}
                      alt={user.name || "Profile"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </header>
            <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 bg-muted/20 overflow-x-hidden">
              <div className="mx-auto w-full max-w-7xl">{children}</div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AdminGuard>
  );
}
