import { collection, getFirestore, getDocs, query, where, updateDoc, arrayUnion } from "firebase/firestore";
import { storage } from "../../pages/firebase_folder/firebase-config";
import { ref, getDownloadURL } from "firebase/storage";
import { Timestamp } from "firebase/firestore";

export default async function handler(req, res) {
  let dataRet = req.body;
  const db = getFirestore();
  let roomID = dataRet.slug;
  let imageAbsUrl = null;
  let sentText = null;
  // if an image is sent 
  if (dataRet.fireBaseImgUrl != null) {
    const storageRef2 = ref(storage, 'gs://whatapp-7rh4b.appspot.com/' + dataRet.fireBaseImgUrl);
    const url = await getDownloadURL(storageRef2); // Await the getDownloadURL function
    imageAbsUrl = url;
  }

  // if text field is empty
  if (dataRet.newMessage == null) {
    sentText 
  }
  const data = {
    content: dataRet.newMessage ? dataRet.newMessage : null,
    user: dataRet.email,
    username: dataRet.pfn,
    pfp: dataRet.img,
    imageURL: imageAbsUrl,
    date: Timestamp.fromDate(new Date())
  };
  // need to get the corresponding document before updating 
  const querySnapshot = await getDocs(
    query(collection(db, "rooms"), where("roomID", "==", roomID))
  );
  // updates messages array
  querySnapshot.forEach((doc) => {
    const roomDocRef = doc.ref;
    updateDoc(roomDocRef, {
      messages: arrayUnion(data),
    });
  });
  res.status(200).send('Ok');
}

// increases the API route body size to 4mb to handle more robust text data
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb'
    }
  }
};
