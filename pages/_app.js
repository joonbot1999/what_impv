import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import Navbar from './navbar';

export default function App({ Component, pageProps }) {

  return(
  <SessionProvider session={pageProps.session}>  
    <div className='flex w-full h-full justify-center'>
      <Navbar/>
      <Component {...pageProps} />
    </div>
  </SessionProvider>
  )
}
