import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAOuNmNbW7yuDNrLF9sznhJ8DQMsDDiRbY",
  authDomain: "unheard-c083f.firebaseapp.com",
  projectId: "unheard-c083f",
  storageBucket: "unheard-c083f.firebasestorage.app",
  messagingSenderId: "25249364567",
  appId: "1:25249364567:web:4ff387dddf30af9367c112",
  measurementId: "G-2G5VF3F9JF"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
