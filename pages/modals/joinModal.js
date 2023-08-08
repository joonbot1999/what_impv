import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../../pages/firebase_folder/firebase-config";
import { useSession } from 'next-auth/react';
import { motion } from "framer-motion";

export default function CreateModal({isOpen, callBack}) {
    const { data: session, status } = useSession();
    const [rooms, createRoomList]= useState([]);
    const [triggerCreate, isTriggerCreate] = useState(true);
    const modalRef = useRef(null);
    const [roomJoined, roomJoinedChecked] = useState(false);

    // function for handling room join and callback
    async function joinRoom() {
        let roomID = modalRef.current.value;
        // such room does not exist
        if (!rooms.includes(roomID)) {
            callBack(true);
            isTriggerCreate(true);
            alert("This room doesn't exist");
        // such room does indeed exist
        } else if (rooms.includes(roomID)){
            const userEmail = session["user"]["email"];
            await fetch('/api/join', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ roomID, userEmail })
            });
            alert("Room joined");
            callBack(false);
            isTriggerCreate(true);
            roomJoinedChecked(true);
        }
    }

    /*
    need to add onSnapShot somewhere in here to update the room from the db live
    */
    useEffect(() => {
        //fetch rooms 
        let roomArray = [];
        async function fetchData() {
            // a collection of rooms
            const coll = collection(db, "rooms")
            const roomCollection = await getDocs(coll);
            roomCollection.forEach((doc) => {
              const dataVal = doc.data();
              // only need roomID
              roomArray.push(dataVal.roomID);
            });
            createRoomList(roomArray);
            roomJoinedChecked(false);
        }
        fetchData();
    }, [roomJoined])

    if (triggerCreate) {
        return (
            <motion.div className="text-black cursor-pointer font-semibold text-lg hover:underline" whileHover={{scale: 1.2}} onClick={() => {isTriggerCreate(false)}}>Join</motion.div>
        )
    } else {
        return (
            <div className="absolute flex items-center z-10 bg-blue-300 h-screen">
                <div className="flex-col justify-center items-center space-y-4 w-full text-center">
                    <div>Join a room</div>
                    <input ref={modalRef} className="w-full text-center"/>
                    <button onClick={() => joinRoom()}>Join</button>
                </div>
            </div>
    )}

}