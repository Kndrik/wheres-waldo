import { initializeApp } from "firebase/app";
import { getFirestore, collection  } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDmCpmpDrCxuC9lMmi5YWBq5eJHTu1ICOo",
    authDomain: "wheres-waldo-9b73f.firebaseapp.com",
    projectId: "wheres-waldo-9b73f",
    storageBucket: "wheres-waldo-9b73f.appspot.com",
    messagingSenderId: "171732216523",
    appId: "1:171732216523:web:d18339782b446cec06c94e"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const usersCollectionRef = collection(db, 'users');
const charactersCollectionRef = collection(db, 'characters');

export { app, db, auth, signInAnonymously, usersCollectionRef, charactersCollectionRef };