// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6uy4sq17O_XHEbz9WMJAaiwzjenXS8WI",
  authDomain: "collaborative-coding-a831e.firebaseapp.com",
  projectId: "collaborative-coding-a831e",
  storageBucket: "collaborative-coding-a831e.appspot.com",
  messagingSenderId: "179546591650",
  appId: "1:179546591650:web:b59d1cfb0e83bf034062fb",
  measurementId: "G-ZBDRHJT2C4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db,  };