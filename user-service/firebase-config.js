import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyABLosHB8FvOD9kPxca3VIwoTwBqv6JJtI",
    authDomain: "cs3219-8da08.firebaseapp.com",
    databaseURL: "https://cs3219-8da08-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "cs3219-8da08",
    storageBucket: "cs3219-8da08.appspot.com",
    messagingSenderId: "33190417056",
    appId: "1:33190417056:web:d5c61a99a3364fc4f82fc5",
    measurementId: "G-TV3MB9NDV4"
};
 
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app