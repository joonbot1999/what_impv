import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Navbar from './navbar';

export default function App({ Component, pageProps }) {

  return(
  <SessionProvider session={pageProps.session}>  
    <Navbar/>
    <Component {...pageProps} />
  </SessionProvider>
  )
}
