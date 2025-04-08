
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1D6tZkWm_oUypWWWU7e8EJ0MysF_eJW8",
  authDomain: "market-mood-analyzer.firebaseapp.com",
  projectId: "market-mood-analyzer",
  storageBucket: "market-mood-analyzer.appspot.com",
  messagingSenderId: "426934177801",
  appId: "1:426934177801:web:4ef22e27ce790ccd7e85a4",
  measurementId: "G-E1X20F7HZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
