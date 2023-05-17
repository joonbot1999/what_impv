import { data } from "autoprefixer";
import { addDoc, collection, getFirestore, doc, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { getSession } from "next-auth/react";
import { IM_Fell_Double_Pica_SC } from "next/font/google";

export default async function handler(req, res) {
    let dataRet = req.body;
    const db = getFirestore();
    console.log("step1");
    let userEmail = dataRet.userEmail;
    //const roomDocRef = doc(db, "users");
    const messageRef = collection(db, "users");
    await addDoc(messageRef, {
        rooms: ['1'], 
        user: userEmail
    });
    res.status(200).send('Ok');

}