import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the auth token from localStorage via the cookie (we'll set this from the client)
  const authToken = request.cookies.get('auth_token')?.value;
  
  // List of public paths that don't require authentication
  const publicPaths = ['/auth/signin', '/auth/error'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
  
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
  
  // User is authenticated, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/students/:path*',
    '/products/:path*', 
    '/exams/:path*',
    '/admin/:path*',
    '/'
  ],
};