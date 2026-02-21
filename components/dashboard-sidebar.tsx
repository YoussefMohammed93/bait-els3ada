"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Heart,
  Grid,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const data = {
  navMain: [
    {
      title: "لوحة التحكم",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "الفئات",
      url: "/dashboard/categories",
      icon: Grid,
    },
    {
      title: "المنتجات",
      url: "/dashboard/products",
      icon: Package,
    },
    {
      title: "الطلبات",
      url: "/dashboard/orders",
      icon: ShoppingCart,
    },
    {
      title: "العملاء",
      url: "/dashboard/customers",
      icon: Users,
    },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const pathname = usePathname();

  return (
    <Sidebar side="right" collapsible="icon" className="border-l" {...props}>
      <SidebarHeader className="h-16 flex items-center justify-center border-b w-full">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent"
            >
              <a href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Heart className="size-4 fill-current" />
                </div>
                {!isCollapsed && (
                  <div className="flex flex-col gap-0.5 leading-none overflow-hidden transition-all duration-300">
                    <span className="font-black text-xl text-foreground whitespace-nowrap">
                      بيت السعادة
                    </span>
                  </div>
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel
            className={cn(
              "text-muted-foreground font-bold text-xs px-4 mb-2 transition-all duration-300",
              isCollapsed && "opacity-0",
            )}
          >
            القائمة الرئيسية
          </SidebarGroupLabel>
          <SidebarGroupContent className="w-full">
            <SidebarMenu className="gap-1">
              {data.navMain.map((item) => {
                const isActive =
                  item.url === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-200 h-11 rounded-xl",
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/15"
                          : "hover:bg-muted",
                      )}
                    >
                      <a
                        href={item.url}
                        className="flex items-center gap-3 w-full px-3"
                      >
                        <item.icon
                          className={cn(
                            "size-5 flex-shrink-0 transition-transform",
                            isActive && "scale-110",
                          )}
                        />
                        {!isCollapsed && (
                          <span className="font-bold">{item.title}</span>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
