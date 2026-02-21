"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const user = useQuery(api.users.currentUser);

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    } else if (!isLoading && user && user.userRole !== "admin") {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user || user.userRole !== "admin") {
    return (
      <div className="flex flex-col gap-3 h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xl font-medium text-muted-foreground">
          جاري التحميل...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
