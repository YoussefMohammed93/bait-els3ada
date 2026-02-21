import {
  createRouteMatcher,
  isAuthenticatedNextjs,
  convexAuthNextjsMiddleware,
} from "@convex-dev/auth/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default convexAuthNextjsMiddleware((request: NextRequest) => {
  if (isProtectedRoute(request) && !isAuthenticatedNextjs()) {
    return NextResponse.redirect(new URL("/", request.url));
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
