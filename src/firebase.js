// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4L3uo_3McSrOVKHyoy-Sg6Xk9IKV49cQ",
  authDomain: "campflow-c98d3.firebaseapp.com",
  projectId: "campflow-c98d3",
  storageBucket: "campflow-c98d3.firebasestorage.app",
  messagingSenderId: "100649329781",
  appId: "1:100649329781:web:c58c42cbdf805f6c3dc43c",
  measurementId: "G-EQW0LVNJH5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);