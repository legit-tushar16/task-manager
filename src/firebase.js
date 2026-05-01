import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQ6RDx11tZ6VdO1HE1SSkNSjU6IRMn410",
  authDomain: "task-manager-f7d46.firebaseapp.com",
  projectId: "task-manager-f7d46",
  storageBucket: "task-manager-f7d46.firebasestorage.app",
  messagingSenderId: "190919590451",
  appId: "1:190919590451:web:f4601f7d16cc028be61946"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);