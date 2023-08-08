import { useRef } from "react";
import { useSession } from 'next-auth/react';
import { AnimatePresence, motion } from "framer-motion";
import { storage } from "../firebase_folder/firebase-config";
import { uploadString } from "firebase/storage";
import { ref } from "firebase/storage";
const CryptoJS = require('crypto-js');

export default function EditProfile({ isOpen, handleProfileClick }) {
  const { data: session, status } = useSession();
  const imageRef = useRef(null);
  const textRef = useRef(null);

  async function changePfpInfo(event) {
    event.preventDefault();
    // Handle the profile change logic
    let imageUrl = "";
    let pfpTitle = textRef.current.value;
    if (imageRef.current.files[0] === undefined && pfpTitle === "") {
    } else {
      if (imageRef.current.files && imageRef.current.files[0]) {
        imageUrl = await getImageData(imageRef.current.files[0]);
        const base64URL = imageUrl.substring(imageUrl.indexOf(',') + 1);
        console.log(base64URL);
        let uHash = CryptoJS.SHA256(base64URL);
        let imgString4Firebase = uHash.toString();
        imageUrl = imgString4Firebase;
        const storageRef = ref(storage, imgString4Firebase);
        // MANDATORY TO SEND THE FILE AS AN IMAGE
        const metadata = {
          contentType: 'image/jpeg',
        };
        // makes sure every event that comes after happen after the image is uploaded to the db
        await uploadString(storageRef, base64URL, 'base64', metadata).then((snapshot) => {
          console.log('Uploaded a base64 string!');
        });
      } else {
        imageUrl = null;
      }
      if (pfpTitle == "") {
        pfpTitle = null;
      }
      await fetch("/api/changePfp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl, pfpTitle, email: session.user.email}),
      });
    }

    handleProfileClick(!isOpen);
  }

  function getImageData(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsDataURL(file);
    });
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="modal"
          initial={{ y: -1000 }}
          animate={{ y: 0 }}
          exit={{ y: -1000 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-200 shadow-lg absolute left-1/4 top-1/4 transform h-1/3 w-1/2 p-6 rounded-lg"
        >
          <div className="mb-4">
            <label className="text-lg font-semibold">Profile Name</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded"
              type="text"
              ref={textRef}
            />
          </div>
          <div className="mb-4">
            <label className="text-lg font-semibold">Profile Image</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded"
              type="file"
              accept="image/*"
              ref={imageRef}
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600"
            onClick={changePfpInfo}
          >
            Change profile
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="text-black cursor-pointer font-semibold text-lg hover:underline"
          whileHover={{ scale: 1.2 }}
          onClick={handleProfileClick}
        >
          Edit Profile
        </motion.div>
      )}
    </AnimatePresence>
  );
}
