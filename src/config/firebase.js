// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
//
// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBT3HHX0fHiNy7k-mFYCEd-WJ73wN3XHHc",
//     authDomain: "uploadingfile-e1825.firebaseapp.com",
//     projectId: "uploadingfile-e1825",
//     storageBucket: "uploadingfile-e1825.appspot.com",
//     messagingSenderId: "853271689994",
//     appId: "1:853271689994:web:502d3cd3c88741da8e98f3"
// };
//
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDCHnSFnT15cdT-zkWDC5c6ObPg7yY2qyg",
    authDomain: "adultery-project.firebaseapp.com",
    projectId: "adultery-project",
    storageBucket: "adultery-project.appspot.com",
    messagingSenderId: "294002037822",
    appId: "1:294002037822:web:6da75add512dc8a992ed6f",
    measurementId: "G-SVB9T004PP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);