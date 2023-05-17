import { collection, getFirestore, getDocs, query, arrayUnion, updateDoc, where } from "firebase/firestore";

export default async function handler(req, res) {
    let dataRet = req.body;
    const db = getFirestore();
    let userEmail = dataRet.userEmail;
    let roomID = dataRet.roomID;
    const messageRef = collection(db, "users");
    const querySnapshot = await getDocs(
        query(collection(db, "users"), where("user", "==", userEmail))
      );
    querySnapshot.forEach((doc) => {
        const roomDocRef = doc.ref;
        updateDoc(roomDocRef, {
          rooms: arrayUnion(roomID),
        });
      });
    res.status(200).send('Ok');

}