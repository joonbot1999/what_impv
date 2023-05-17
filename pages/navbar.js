import { useSession, signOut } from 'next-auth/react';
import Link from "next/link";
import { use, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, getDocs, doc, getFirestore, query, where } from 'firebase/firestore';
import { db } from "../pages/firebase_folder/firebase-config";
import CreateModal from './modals/createModal';
import JoinModal from './modals/joinModal';

export default function navbar() {
  const { data: session, status } = useSession();
  const [routes, makeRoutes] = useState([]);
  const [room, makeRoom] = useState(false);
  const [isAdded, setAdded] = useState(false);
  const [triggerCreate, isTriggerCreate] = useState(false);
  const modalRef = useRef(null);

  async function handleSignout(e) {
    await signOut();
  }



  function roomCR(isCreated) {
    console.log(isCreated);
    if (!isCreated) {
      setAdded(false);
    }
  }

  /*async function joinExistingRoom() {
    let roomID = modalRef.current.value;
    const userEmail = session["user"]["email"];
    await fetch('/api/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ roomID, userEmail })
    });
    setAdded(false);
    makeRoom(false);
  }*/

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


  useEffect(() => {
    console.log("fired");
    async function fetchCollection() {
      if (status === "authenticated") {
        const userEmail = session["user"]["email"];
        const messageRef = collection(db, "users");
        const makeQuery = query(messageRef, where("user", "==", userEmail));
        const snapshot = await getDocs(makeQuery);
        let dataVal = null;
        snapshot.forEach((doc) => {
          dataVal = doc.data();
        });

        if (dataVal === null) {
          console.log("hello");
          await fetch('/api/newUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userEmail })
          });
          const newUserQuery = query(messageRef, where("user", "==", userEmail));
          const newUserSnapshot = await getDocs(newUserQuery);
          newUserSnapshot.forEach((doc) => {
            dataVal = doc.data();
          });
        }
        makeRoutes(dataVal.rooms);
        setAdded(true);
      }
    }
    fetchCollection();
  }, [status, isAdded]);


  if (status === "authenticated") {
    return (
      <div>
        <nav>
          {
            routes.map((collection, key) => {
              return (<Link href={`/chatroom/${collection}`}>{collection}</Link>)
            })
          }
          <Link href='/editProfile'>Edit profile</Link>
          <div></div>
          <a onClick={handleSignout}>signOut</a>
          <div></div>
        </nav>
          <CreateModal isOpen={triggerCreate} callBack={roomCR}/>
          <JoinModal isOpen={triggerCreate} callBack={roomCR} onClick={() => {isTriggerCreate(true)}}/>
      </div>
    );
  }

}