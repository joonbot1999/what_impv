import { addDoc, collection, getFirestore } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// endpoint to handle room creation 
export default async function handler(req, res) {
    let dataRet = req.body;
    const db = getFirestore();
    let roomID = dataRet.roomID;
    let userEmail = dataRet.userEmail;
    const collectionRef = collection(db, "rooms");
    // create a piece of data
    const dataPiece = {
        content: userEmail.toString() + " has created a room " + roomID.toString(),
        date: Timestamp.fromDate(new Date()),
        user: 'Bot',
        pfp: 'https://cdn.iconscout.com/icon/free/png-512/free-bot-136-504893.png?f=avif&w=512'
      };
    await addDoc(collectionRef, {
        messages: [dataPiece],
        roomID : roomID
    });

    // the user who created a room is automatically added to the room
    await fetch('http://localhost:3000/api/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomID, userEmail })
      });
    res.status(200).send('Ok');
}