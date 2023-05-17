// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDskGN31hD8Ie7CnwC6hBsq_b-KjSVsH6Y",
  authDomain: "whatapp-6df46.firebaseapp.com",
  databaseURL: "https://whatapp-6df46-default-rtdb.firebaseio.com",
  projectId: "whatapp-6df46",
  storageBucket: "whatapp-6df46.appspot.com",
  messagingSenderId: "635372974428",
  appId: "1:635372974428:web:69a37358ad76ad75c59199",
  measurementId: "G-DZJSPWSSML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider= new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);