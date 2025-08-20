import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware() {
    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Check if user has valid session and is from @hocmai.vn domain
        // return (
        //   !!token &&
        //   !!token.email &&
        //   token.email.endsWith('@hocmai.vn')
        // );
        console.log(token);
        return (
          !!token &&
          !!token.email
        );
      },
    },
  }
);

export const config = {
  matcher: [
    '/((?!api/auth|auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
