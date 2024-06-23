import { NextResponse } from 'next/server';
import { auth } from '~/auth';

const protectedRoutes = ['/wizard', '/settings'];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some((protectedPath) =>
    pathname.startsWith(protectedPath),
  );

  if (isProtectedRoute) {
    if (!req.auth?.isLoggedIn) {
      return NextResponse.redirect(new URL('/api/auth/signin', req.url));
    }
  }
});
