
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // Replace these values with your actual Firebase configuration
  apiKey: "AIzaSyCjMiwpNDNyy4ZoFv3-GGB_awkuoXIdEso",
  authDomain: "marketmood-9bf79.firebaseapp.com",
  projectId: "marketmood-9bf79",
  storageBucket: "marketmood-9bf79.firebasestorage.app",
  messagingSenderId: "80558074955",
  appId: "1:80558074955:web:d258d7d9d049da99a471ce",
  measurementId: "G-9B761V9P44
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
