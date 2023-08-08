import { collection, getFirestore, getDocs, query, updateDoc, where } from "firebase/firestore";
import { storage } from "../../pages/firebase_folder/firebase-config";
import { ref, getDownloadURL } from "firebase/storage";

export default async function handler(req, res) {
    let dataRet = req.body;
    let pfpTitle = dataRet.pfpTitle;
    let imageUrlBase = dataRet.imageUrl;
    let email = dataRet.email;
    // initialized as an empty object
    const updateField = {};
    console.log(pfpTitle, imageUrlBase);
    const db = getFirestore();
    if (imageUrlBase) {
        const storageRef2 = ref(storage, 'gs://whatapp-7rgs2.appspot.com/' + imageUrlBase);
        const url = await getDownloadURL(storageRef2); // Await the getDownloadURL function
        updateField.pfp = url;
    }
    if (pfpTitle) {
        updateField.username = pfpTitle
    }
    const querySnapshot = await getDocs(
        query(collection(db, "users"), where("user", "==", email))
    );
    // room is added under user's list of rooms
    querySnapshot.forEach((doc) => {
        const roomDocRef = doc.ref;
        updateDoc(roomDocRef, updateField);
    });
    res.status(200).send('Ok');
}