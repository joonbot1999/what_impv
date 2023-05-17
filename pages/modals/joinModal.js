import { useEffect, useRef, useState } from "react";
import { collection, getDocs, doc, getFirestore, query, where } from 'firebase/firestore';
import { db } from "../../pages/firebase_folder/firebase-config";
import { useSession } from 'next-auth/react';

export default function CreateModal({isOpen, callBack}) {
    const { data: session, status } = useSession();
    const [rooms, createRoomList]= useState([]);
    const [triggerCreate, isTriggerCreate] = useState(true);
    const modalRef = useRef(null);
    const [roomJoined, roomJoinedChecked] = useState(false);

    async function joinRoom() {
        let roomID = modalRef.current.value;
        if (!rooms.includes(roomID)) {
            callBack(true);
            isTriggerCreate(true);
            alert("This room doesn't exist");
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

    useEffect(() => {
        //fetch rooms 
        let roomArray = [];
        async function fetchData() {
            const coll = collection(db, "rooms")
            const snapshot = await getDocs(coll);
            console.log(snapshot);
            snapshot.forEach((doc) => {
              const dataVal = doc.data();
              roomArray.push(dataVal.roomID);
              console.log(dataVal.roomID);
            });
            createRoomList(roomArray);
            roomJoinedChecked(false);
        }
        fetchData();

    }, [roomJoined])

    if (triggerCreate) {
        return (
            <div onClick={() => {isTriggerCreate(false)}}>Join</div>
        )
    } else {
        return (
        <div>
            <div>Join a room</div>
            <input ref={modalRef}/>
            <button onClick={() => joinRoom()}>Click to join a room</button>
        </div>
    )}

}