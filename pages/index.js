import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const {data: session, status } = useSession();

  console.log(status);

  if (status === "unauthenticated") {

  }

  if (status === "authenticated") {
    
  }
  return (

    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {(status === "unauthenticated") && <button onClick={() => {signIn('google')}}>sign in</button>}
      {(status === "authenticated") && <div>
        {session.user.name}
        </div>}
    </main>
  )
}
