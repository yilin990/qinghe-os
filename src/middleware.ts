import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 强制 no-cache，防止 Safari/浏览器缓存旧版本
  const response = NextResponse.next();
  
  // 清除所有缓存相关的 headers，强制重新验证
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Surrogate-Control", "no-store");
  
  return response;
}

export const config = {
  // 只对清禾页面生效
  matcher: ["/qinghe/:path*"],
};
