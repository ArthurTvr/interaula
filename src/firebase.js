import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5jWWJ_ETJ5JBN-vYImipJsRsFHp8eC14",
  authDomain: "interaula.firebaseapp.com",
  projectId: "interaula",
  storageBucket: "interaula.firebasestorage.app",
  messagingSenderId: "134875291367",
  appId: "1:134875291367:web:19d2244b61957bf18bcc42"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);