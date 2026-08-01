import {NextRequest, NextResponse} from "next/server";
import {getToken} from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";

import {routing} from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET
    });

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/", "/((?!api|_next|_vercel|.*\\..*).*)"]
};