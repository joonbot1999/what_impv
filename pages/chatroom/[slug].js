import { useRouter } from "next/router";
import { useSession, getSession, signOut } from 'next-auth/react';
import { collection, query, where, onSnapshot, } from 'firebase/firestore';
import { db } from "../../pages/firebase_folder/firebase-config";
import { storage } from "../../pages/firebase_folder/firebase-config";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { redirect } from "next/dist/server/api-utils";
const CryptoJS = require('crypto-js');

export default function room({ data }) {
  const inputRef = useRef();
  const router = useRouter();
  const [messages, loadMessages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [fireBaseImgUrl, setFireBaseImgUrl] = useState(null);
  const [base64, setbase64] = useState(null);
  const { data: session, status } = useSession();
  const messagesContainerRef = useRef(null);
  const [channelPresence, setChannelPresence] = useState(false);
  const [email, setEmail] = useState("");
  const [img, setImg] = useState("");
  const [pfn, setPfn] = useState("");

  // handles pasted image and text
  function handleImageAndOrText(event) {
    event.preventDefault()
    let clipboardItems = event.clipboardData.items;
    // for some reason, the true value is always in the second index
    const item = clipboardItems[1];
    // if its an image
    if (item.type.indexOf('image') === 0) {
      // gets the attached file
      const file = item.getAsFile();
      // reads the file
      const reader = new FileReader();
      reader.onloadend = async function() {
        const previewURL = reader.result;
        // generate a short hash for the images as a unique modifier
        const base64URL = previewURL.substring(previewURL.indexOf(',') + 1);
        let uHash = CryptoJS.SHA256(base64URL);
        let imgString4Firebase = uHash.toString();
        setbase64(base64URL);
        setImagePreview(previewURL);
        setFireBaseImgUrl(imgString4Firebase);
      };
      reader.readAsDataURL(file);
    // if its text, set the textarea to the pasted text
    } else if (item.type.indexOf('text') === 0) {
      inputRef.current.value = event.clipboardData.getData("text");
    }
  }

  function handleImageData(imageUrl) {
    const storageRef2 = ref(storage, 'gs://whatapp-6df46.appspot.com/' + imageUrl);
    let linkToRet = "";
    getDownloadURL(storageRef2).then((url) => {
      imageUrl = url;
    })
    return imageUrl
  }

  // handles sending messages
  async function sendMessage() {
    setImagePreview(null);
    let newMessage = inputRef.current.value;
    // if the message field is empty, doesn't do anything 
    console.log("new message " + newMessage);
    console.log("firebaseURl: " + fireBaseImgUrl);
    if (newMessage === "" && fireBaseImgUrl == null) {
      return;
    } else {
      console.log(email);
      console.log(img);
      console.log(pfn);
      if (fireBaseImgUrl) {
        const storageRef = ref(storage, fireBaseImgUrl);
        // MANDATORY TO SEND THE FILE AS AN IMAGE
        const metadata = {
          contentType: 'image/jpeg',
        };
        // makes sure every event that comes after happen after the image is uploaded to the db
        await uploadString(storageRef, base64, 'base64', metadata).then((snapshot) => {
          console.log('Uploaded a base64 string!');
        });
      } 
      const sending = async () => {
        await fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ slug: router.query.slug, newMessage: newMessage ?? null, email, pfn, img, fireBaseImgUrl})
        });
      };
      sending();
      inputRef.current.value = "";
      setFireBaseImgUrl(null);
    }
  }

  // if the user hits enter
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }

  // handles live update by using onSnapShot
  useEffect(() => {
    const messageRef = collection(db, "rooms");
    const makeQuery = query(messageRef, where("roomID", "==", router.query.slug));
    const unsubscribe = onSnapshot(makeQuery, (snapshot) => {
      let dataVal = null;
      snapshot.forEach((doc) => {
        dataVal = doc.data();
      });
      let dataContained = dataVal.messages;
      loadMessages(dataVal.messages);
      // Scroll to the bottom when new messages are received
      setTimeout(() => {
        if (
          messagesContainerRef.current &&
          dataContained[dataContained.length - 1]["user"] === session?.["user"]["email"]
        ) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 0);
    });
    return () => {
      unsubscribe()
    };
  }, [router.query.slug])

  useEffect(() => {
    console.log(session);
    let userEmail = session?.user.email;
    if (userEmail) {
      const userQuery = query(collection(db, 'users'), where('user', '==', userEmail));    
      const unsubscribe = onSnapshot(userQuery, (snapshot) => {
        snapshot.forEach((doc) => {
          setEmail(doc.data().user);
          setImg(doc.data().pfp);
          setPfn(doc.data().username);
        });
      });
      return () => {
        unsubscribe();
      }
    }
  }, [session?.user])

  useEffect(() => {
    setChannelPresence(true);
    return () => {
      setChannelPresence(false);
    };
  }, [router.query.slug]);

  return (
      <motion.div className="flex w-full h-screen flex-col items-center overflow-y-hidden"
                      initial={{ opacity: 0}}
                      animate={{ opacity: 1}}
                      exit={{ opacity: 0}}
                      transition={{duration: 1}}>
        <div className="top-0 text-6xl mb-4 flex justify-center items-center">
          <div>channel {" " + router.query.slug}</div>
        </div>
        <div className="overflow-y-auto h-full w-full bg-gray-100 p-4 bottom-0" ref={messagesContainerRef}>
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-start mb-4"
              >
                <img src={message.pfp} alt="Profile Picture" className="w-8 h-8 rounded-full mr-2" />
                <div className="flex flex-col">
                  <div className="text-sm font-medium">{message.username}</div>
                  <div className="bg-white p-2 rounded-lg shadow w-fit">{message.content}</div>
                  {message.imageURL && 
                  <img className="w-72" src={message.imageURL}></img>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="w-full h-1/3 flex items-center justify-center bg-red-200 rounded-md">
          <div className="bottom-0">
            {imagePreview && <img className="w-72" src={imagePreview}/>}
          </div>
          <textarea
            className="w-3/4 h-1/2 rounded-md"
            ref={inputRef}
            placeholder="Type your message here"
            onKeyDown={handleKeyDown}
            onPaste={handleImageAndOrText}
          ></textarea>

        </div>
      </motion.div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  // this is a server side code. If I were to access client side API, it'll throw some erros like window
  // in SSR, html from react components is pre-rendered, which is hydrated(inject JS juice)
  // because html is rendered on the server, it doesn't have access to window element, which is client only
  if (session == null) {
    return {
      redirect: {
        destination: "/",
        permanent: true
      }
    };
  } else {
      return {
        props: session
      };
  }
}
