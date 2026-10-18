import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  if (hostname === 'connect.jerisomtrade.com' || hostname === 'www.connect.jerisomtrade.com') {
    // Avoid double-prepending /connect if already present
    if (url.pathname.startsWith('/connect')) {
      return NextResponse.rewrite(new URL(url.pathname, req.url));
    }
    return NextResponse.rewrite(
      new URL(`/connect${url.pathname === '/' ? '' : url.pathname}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)',
  ],
};
