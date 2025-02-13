// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { functions } from "firebase/functions";

// Initialize Firebase
const app = initializeApp(functions.config().react_app);

export default app;
