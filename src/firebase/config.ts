// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSz6IBz0YBdHr4mgKzzN8vaTnjXxd-2KE",
  authDomain: "scsdaamievent.firebaseapp.com",
  projectId: "scsdaamievent",
  storageBucket: "scsdaamievent.firebasestorage.app",
  messagingSenderId: "947375829992",
  appId: "1:947375829992:web:d4a411c92ff81bb59e6a5d",
  measurementId: "G-1V3FQ0L5HT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 