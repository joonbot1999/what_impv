import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../../pages/firebase_folder/firebase-config";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function LeaveModal({ isOpen, callBack }) {
  const { data: session, status } = useSession();
  const [rooms, createRoomList] = useState([]);
  const modalRef = useRef(null);
  const [triggerCreate, isTriggerCreate] = useState(true);
  const [roomCreated, roomCreatedChecked] = useState(false);
  const router = useRouter();

  // handling leave event 
  async function leaveRoom() {
    let roomID = modalRef.current.value;
    if (!rooms.includes(roomID)) {
      callBack(true);
      isTriggerCreate(true);
      alert("You're not even in that room dumbass");
    } else if (roomID === "") {
      callBack(true);
      isTriggerCreate(true);
      alert("Room name cannot be empty");
    } else {
      const userEmail = session["user"]["email"];
      await fetch("/api/leaveRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail, roomID }),
      });
      alert("Room left");
      callBack(false);
      isTriggerCreate(true);
      roomCreatedChecked(true);

      // Redirect to the chatroom with ID 1
      router.push("/chatroom/1");
    }
  }

  // gets the list of rooms
  useEffect(() => {
    async function fetchData() {
      const coll = collection(db, "rooms");
      const snapshot = await getDocs(coll);
      let roomArray = [];
      snapshot.forEach((doc) => {
        const dataVal = doc.data();
        roomArray.push(dataVal.roomID);
      });
      createRoomList(roomArray);
      roomCreatedChecked(false);
    }
    fetchData();
  }, [roomCreated]);

  if (triggerCreate) {
    return (
      <motion.div
        className="text-black cursor-pointer font-semibold text-lg hover:underline"
        whileHover={{ scale: 1.2 }}
        onClick={() => {
          isTriggerCreate(false);
        }}
      >
        Leave
      </motion.div>
    );
  } else {
    return (
      <div className="absolute flex items-center z-10 bg-blue-300 h-screen">
        <div className="flex-col justify-center items-center space-y-4 w-full text-center">
          <div>Leave a room</div>
          <input ref={modalRef} className="w-full text-center" />
          <button onClick={() => leaveRoom()}>Leave</button>
        </div>
      </div>
    );
  }
}
