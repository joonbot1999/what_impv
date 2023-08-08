import { useSession, signOut } from 'next-auth/react';
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../pages/firebase_folder/firebase-config";
import CreateModal from './modals/createModal';
import JoinModal from './modals/joinModal';
import LeaveModal from './modals/leaveModal';
import EditProfileModal from './modals/editProfile';

export default function navbar() {
  const { data: session, status } = useSession();
  const [routes, makeRoutes] = useState([]);
  const [room, makeRoom] = useState(false);
  const [isAdded, setAdded] = useState(false);
  const [triggerCreate, isTriggerCreate] = useState(false);
  const [isProfileOpen, profileOpen] = useState(false);
  const modalRef = useRef(null);

  const variants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  };

  // handles user signout 
  async function handleSignout(e) {
    await signOut();
  }

  // handles room creation/join/leave event as a callback function 
  function roomCR(isCreated) {
    console.log("created")
    if (!isCreated) {
      // when this state changes, useEffect hook runs again
      setAdded(false);
    }
  }

  // fired only on initial mount 
  useEffect(() => {
    async function fetchData() {
      const coll = collection(db, "rooms")
      const snapshot = await getDocs(coll);
      console.log(snapshot);
      snapshot.forEach((doc) => {
        const dataVal = doc.data();
        console.log(dataVal.roomID);
      });
    }
    fetchData();
  }, []);

  function handleProfileClick(isOpenCheck) {
    profileOpen(isOpenCheck);
  }

  // fired again if the user's authentication status changes
  useEffect(() => {
    async function fetchCollection() {
      if (status === "authenticated") {
        // grabs session data returned by useSession hook
        const userEmail = session["user"]["email"];
        const pfp = session["user"]["image"];
        const userName = session["user"]["name"];
        const messageRef = collection(db, "users");
        const makeQuery = query(messageRef, where("user", "==", userEmail));
        console.log(makeQuery);
        const snapshot = await getDocs(makeQuery);
        let dataVal = null;
        snapshot.forEach((doc) => {
          dataVal = doc.data();
        });
        // if a logged in user doesn't exist in the db, then the user is new
        if (dataVal === null) {
          await fetch('/api/newUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userEmail, pfp, userName })
          });
          const newUserQuery = query(messageRef, where("user", "==", userEmail));
          const newUserSnapshot = await getDocs(newUserQuery);
          newUserSnapshot.forEach((doc) => {
            dataVal = doc.data();
          });
        }
        // list of rooms are added to the state hook
        makeRoutes(dataVal.rooms);
        setAdded(true);
      }
    }
    fetchCollection();
  }, [status, isAdded]);

  if (status === "authenticated") {
    return (
      <div className="flex h-screen w-1/4 bg-white">
        <div className="flex flex-col justify-center items-center w-1/2">
          <EditProfileModal isOpen={isProfileOpen} handleProfileClick={handleProfileClick}/>
          <CreateModal callBack={roomCR}/>
          <JoinModal callBack={roomCR} onClick={() => { isTriggerCreate(true) }} />
          <LeaveModal callBack={roomCR}/>
          <motion.a onClick={handleSignout} className="text-black cursor-pointer font-semibold text-lg hover:underline" whileHover={{scale: 1.2}}>Sign Out</motion.a>
        </div>
        <ul className="flex flex-col items-center space-y-4 bg-red-300 w-1/2">
            {routes.map((collection, key) => (
              <motion.li
                key={key}
                initial="hidden"
                animate="visible"
                variants={variants}
                transition={{ duration: 0.5, delay: key * 0.1 }}
                className="h-12 flex flex-col items-center font-serif"
              >
                <Link href={`/chatroom/${collection}`}>
                  <motion.a
                    className="bg-blue-100 mt-4 rounded-lg w-36 flex justify-center items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {collection}
                  </motion.a>
                </Link>
              </motion.li>
            ))}
          </ul>
      </div>
    );
  }

}