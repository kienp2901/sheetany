import { NextRequest, NextResponse } from 'next/server';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('JWT parse error in middleware:', e);
    return null;
  }
}

export function middleware(request: NextRequest) {
  // Get the auth token from localStorage via the cookie (we'll set this from the client)
  const authToken = request.cookies.get('auth_token')?.value;

  // List of public paths that don't require authentication
  const publicPaths = ['/auth/signin', '/auth/error'];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Allow access to public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!authToken) {
    // Redirect to signin page if not authenticated
    const signInUrl = new URL('/auth/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Check if token is expired
  try {
    const tokenPayload = parseJwt(authToken);
    const isTokenExpired =
      tokenPayload && tokenPayload.exp
        ? Date.now() >= tokenPayload.exp * 1000
        : false;

    if (isTokenExpired) {
      console.warn('Token expired in middleware, redirecting to signin...');
      // Clear the expired token cookie
      const response = NextResponse.redirect(
        new URL('/auth/signin', request.url)
      );
      response.cookies.set('auth_token', '', {
        expires: new Date(0),
        path: '/',
      });
      return response;
    }
  } catch (error) {
    console.error('Error parsing token in middleware:', error);
    // If token is malformed, redirect to signin
    const signInUrl = new URL('/auth/signin', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // User is authenticated and token is valid, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/students/:path*',
    '/products/:path*',
    '/exams/:path*',
    '/admin/:path*',
    '/',
  ],
};
