import { useEffect, useRef, useState } from "react";
import { collection, getDocs, doc, getFirestore, query, where } from 'firebase/firestore';
import { db } from "../../pages/firebase_folder/firebase-config";
import { useSession } from 'next-auth/react';

export default function CreateModal({isOpen, callBack}) {
    const { data: session, status } = useSession();
    const [rooms, createRoomList]= useState([]);
    const modalRef = useRef(null);
    const [triggerCreate, isTriggerCreate] = useState(true);
    const [roomCreated, roomCreatedChecked] = useState(false);

    async function createRoom() {
        let roomID = modalRef.current.value;
        if (rooms.includes(roomID)) {
            callBack(true);
            isTriggerCreate(true);
            alert("This room already exists");
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
            isTriggerCreate(true);
            roomCreatedChecked(true);
        }
    }

    useEffect(() => {
        //fetch rooms 
        let roomArray = [];
        // useState hooks placed inside useEffect to make it execute outside of main thread 
        async function fetchData() {
            const coll = collection(db, "rooms")
            const snapshot = await getDocs(coll);
            console.log(snapshot);
            snapshot.forEach((doc) => {
              const dataVal = doc.data();
              roomArray.push(dataVal.roomID);
              console.log(dataVal.roomID);
            });
            // Only want these two to run along with fetchData function (async)
            createRoomList(roomArray);
            roomCreatedChecked(false);
        }
        fetchData();

    }, [roomCreated])

    if (triggerCreate) {
        return (
            <div onClick={() => {isTriggerCreate(false)}}>Create</div>
        )
    } else {
        return (
        <div>
            <div>Create a room</div>
            <input ref={modalRef}/>
            <button onClick={() => createRoom()}>Click to make a room</button>
        </div>
    )}

}