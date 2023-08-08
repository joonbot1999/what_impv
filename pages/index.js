import { Inter } from 'next/font/google'
import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const {data: session, status } = useSession();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-purple-200 w-screen">
      {(status === "unauthenticated") && 
      <div className='flex flex-col justify-center'>
        <div className='flex justify-center overflow-hidden'>
          <motion.div initial={{y: '100%', opacity: 0}} whileInView={{y: 0, opacity: 1}} transition={{duration: 2}} className="font-serif font-bold text-xxx text-amber-700">WHAT</motion.div>
        </div>
        <motion.div initial={{y: '100%', opacity: 0}} whileInView={{y: 0, opacity: 1}} transition={{duration: 2, delay: 1}} className="text-center font-serif text-2xl -mt-5">Modern texting solution for boundless bois</motion.div>
        <motion.div initial={{y: '100%', opacity: 0}} whileInView={{y: 0, opacity: 1}} transition={{delay: 2}} className='flex justify-center mt-5 items-center'>
          <motion.button 
            whileHover={{scale: 1.9}} 
            className="text-center w-1/4 h-10 bg-white mt-5" 
            onClick={() => {signIn('google', {callbackUrl: 'http://localhost:3000/chatroom/1'})}}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            Sign In
            <motion.div
              className="absolute top-0 left-0 bg-black h-full w-1"
              initial={{scaleY: 0.1}}
              animate={{scaleY: isHovered ? 1 : 0}}
              transition={{duration: 0.2}}
            />
            <motion.div
              className="absolute top-0 right-0 bg-black h-full w-1"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2}}
            />            
            <motion.div
              className="absolute bottom-0 bg-black h-1 w-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2}}
            />
            <motion.div
              className="absolute top-0 bg-black h-1 w-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        </motion.div>
      </div>
      }
      {(status === "authenticated") && 
      <div className='flex-col items-center text-center font-extralight text-5xl space-y-5'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          Welcome
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          {session.user.name}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          This is a chatroom I made exclusively for UW students
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
          To get started, join room 1 up on the navbar
        </motion.div>
      </div>
      }
    </main>
  )
}
