import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { redirect } from 'next/dist/server/api-utils';
export const authOptions = {
 providers: [
  GoogleProvider({
   clientId: process.env.CLIENT_ID,
   clientSecret: process.env.CLIENT_SECRET,
  }),
 ],
 session: {
  strategy: 'jwt',
 },
 callbacks: {
   async signIn( {user}) {
      if (user.email.includes("@uw.edu")) {
         return true;
      } else {
         // or I can return a URL to redirect to, but I'm doing that under pages
         return false;
      }
   }
 },
 pages: {
   error: '/error/oopsiepoopsie'
 }
};


export default NextAuth(authOptions);