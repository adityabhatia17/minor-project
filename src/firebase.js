import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBHKju_PEKXkvliLEJZ7pygwf2pUNoNxUc",
  authDomain: "resumebuilder-b8a4d.firebaseapp.com",
  projectId: "resumebuilder-b8a4d",
  storageBucket: "resumebuilder-b8a4d.appspot.com",
  messagingSenderId: "775970956419",
  appId: "1:775970956419:web:7d70302012d52e524fa7b6",
  measurementId: "G-0X0QZ8W796",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, doc, setDoc };
