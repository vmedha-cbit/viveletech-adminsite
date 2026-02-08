import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIUcBRId6ZBjmRy1JiP8I1JO8YuYdxDd4",
  authDomain: "vive-le-tech.firebaseapp.com",
  projectId: "vive-le-tech",
  storageBucket: "vive-le-tech.firebasestorage.app",
  messagingSenderId: "1087488645780",
  appId: "1:1087488645780:web:d9d0a12d126aecb785f281",
  measurementId: "G-7JP6E896XX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
