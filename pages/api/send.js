import { data } from "autoprefixer";
import { addDoc, collection, getFirestore, doc, getDocs, query, where, updateDoc, arrayUnion } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { getSession } from "next-auth/react";
import { IM_Fell_Double_Pica_SC } from "next/font/google";

export default async function handler(req, res) {
    let dataRet = req.body;
    const db = getFirestore();
    let roomID = dataRet.slug;
    const data = {
      content: dataRet.newMessage,
      user: dataRet.userEmail,
      date: Timestamp.fromDate(new Date())
    }
    const querySnapshot = await getDocs(
      query(collection(db, "rooms"), where("roomID", "==", roomID))
    );
    querySnapshot.forEach((doc) => {
      const roomDocRef = doc.ref;
      updateDoc(roomDocRef, {
        messages: arrayUnion(data),
      });
    });
    console.log(querySnapshot);
    res.status(200).send('Ok');

}