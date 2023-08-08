import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../../pages/firebase_folder/firebase-config";
import { useSession } from 'next-auth/react';
import { motion } from "framer-motion";

export default function CreateModal({isOpen, callBack}) {
    const { data: session, status } = useSession();
    const [rooms, createRoomList]= useState([]);
    const modalRef = useRef(null);
    const [triggerCreate, isTriggerCreate] = useState(true);
    const [roomCreated, roomCreatedChecked] = useState(false);

    // function for adding a room and handling callback
    async function createRoom() {
        let roomID = modalRef.current.value;
        if (rooms.includes(roomID)) {
            callBack(true);
            isTriggerCreate(true);
            alert("This room already exists");
        } else if (roomID === "") {
            callBack(true);
            isTriggerCreate(true);
            alert("Room name cannot be empty");
        } else {
            const userEmail = session["user"]["email"];
            await fetch('/api/createRoom', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userEmail, roomID })
              });
            alert("Room created");
            callBack(false);
            // triggers callback
            isTriggerCreate(true);
            roomCreatedChecked(true);
        }
    }

    // to get the list of pre-existing rooms
    useEffect(() => {
        //fetch rooms 
        let roomArray = [];
        // useState hooks placed inside useEffect to make it execute outside of main thread 
        async function fetchData() {
            const coll = collection(db, "rooms")
            const snapshot = await getDocs(coll);
            snapshot.forEach((doc) => {
              const dataVal = doc.data();
              roomArray.push(dataVal.roomID);
            });
            // Only want these two to run along with fetchData function (async)
            createRoomList(roomArray);
            roomCreatedChecked(false);
        }
        fetchData();

    }, [roomCreated])

    if (triggerCreate) {
        return (
            <motion.div className="text-black cursor-pointer font-semibold text-lg hover:underline" whileHover={{scale: 1.2}} onClick={() => {isTriggerCreate(false)}}>Create</motion.div>
        )
    } else {
        return (
            <div className="absolute flex items-center z-10 bg-blue-300 h-screen">
                <div className="flex-col justify-center items-center space-y-4 w-full text-center">
                    <div>Create a room</div>
                    <input ref={modalRef} className="w-full text-center" />
                    <button onClick={() => createRoom()}>Create</button>
                </div>
            </div>
    )}

}