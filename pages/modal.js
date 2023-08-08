import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] })

export default function Modal({ children }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      {children}
    </div>
  )
}
