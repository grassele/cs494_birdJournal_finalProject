// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBnEs_iueMasAdsEHj0FiOBn1TKmnZd-2M",
  authDomain: "birdjournal-1766a.firebaseapp.com",
  projectId: "birdjournal-1766a",
  storageBucket: "birdjournal-1766a.appspot.com",
  messagingSenderId: "318530220621",
  appId: "1:318530220621:web:466a157e281356d926a204"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth();