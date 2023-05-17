import { addDoc, collection, getFirestore, doc, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    let dataRet = req.body;
    const db = getFirestore();
    let roomID = dataRet.roomID;
    let userEmail = dataRet.userEmail;
    //const roomDocRef = doc(db, "users");
    //const messageRef = doc(db, "rooms", roomID);
    const collectionRef = collection(db, "rooms");
    //console.log(messageRef);
    await addDoc(collectionRef, {
        messages: {
            0: {
                content: userEmail.toString() + " has created a room " + roomID.toString(),
                date: Timestamp.fromDate(new Date()),
                user: dataRet.userEmail
            }
        },
        roomID : roomID
    });
    await fetch('http://localhost:3000/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomID, userEmail })
      });
    res.status(200).send('Ok');
}