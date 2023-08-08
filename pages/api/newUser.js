import { addDoc, collection, getFirestore } from "firebase/firestore";

// when a new user joins, they are automatically added to room 1
export default async function handler(req, res) {
    let dataRet = req.body;
    const db = getFirestore();
    const messageRef = collection(db, "users");
    await addDoc(messageRef, {
        rooms: ['1'], 
        user: dataRet.userEmail,
        username: dataRet.userName,
        pfp: dataRet.pfp
    });
    res.status(200).send('Ok');

}