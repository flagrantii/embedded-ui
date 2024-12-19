// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// import { getDatabase } from "firebase/database";
//import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDX8xSf39GStlRH5UQLTGSy_6Xo0sIqsRE",
  authDomain: "embedded-project-aa0e1.firebaseapp.com",
  databaseURL: "https://embedded-project-aa0e1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "embedded-project-aa0e1",
  storageBucket: "embedded-project-aa0e1.firebasestorage.app",
  messagingSenderId: "984908151070",
  appId: "1:984908151070:web:7da611e859b48d10e4710f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
// Get a database reference to our posts
export { database };