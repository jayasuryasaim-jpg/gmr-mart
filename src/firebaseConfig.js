import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1Ma_EYwMS_K9uL4p0uKMII7qJPtoUIs0",
  authDomain: "my-smart-cart-project.firebaseapp.com",
  projectId: "my-smart-cart-project",
  storageBucket: "my-smart-cart-project.firebasestorage.app",
  messagingSenderId: "32649253749",
  appId: "1:32649253749:web:0c6c9de9bb9f6cffa6b93c",
  measurementId: "G-B2WGKWKSVF"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);