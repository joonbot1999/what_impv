import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  
  async function middleware(req) {
    if (req.nextauth.token.email.includes("@uw.edu")) {
        console.log("This person is a UW student");
    } else {
        console.log("Not a UW student");
    }
  }, 
  {
    callbacks: {
        authorized: ({token}) => token?.email.includes("@uw.edu")
    }
  }, {
    pages: {
      signIn: '/pages/index',
      signOut: '/pages/index'
    }
  }
)