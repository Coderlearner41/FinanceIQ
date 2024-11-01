import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkWzrpOE0VagWrm_uL-a1zspebd4Xx7rA",
  authDomain: "financeiq-f9d53.firebaseapp.com",
  projectId: "financeiq-f9d53",
  storageBucket: "financeiq-f9d53.firebasestorage.app",
  messagingSenderId: "551632508917",
  appId: "1:551632508917:web:46d688ab85cc038606b2bc",
  measurementId: "G-QLY0TTLM83"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
