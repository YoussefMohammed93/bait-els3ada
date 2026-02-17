import {
  SidebarInset,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar";
import NextImage from "next/image";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
                  ريهام جمال
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  مدير النظام
                </span>
              </div>
              <div className="relative size-10 rounded-full">
                <NextImage
                  src="/girl.png"
                  alt="ريهام جمال"
                  fill
                  className="rounded-full object-cover p-0.5"
                />
              </div>
            </div>
          </header>
          <main className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 bg-muted/20 overflow-x-hidden">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
