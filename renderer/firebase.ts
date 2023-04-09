// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, signInWithPopup,browserLocalPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { FieldValue, Timestamp, addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC7cStwSXGkeZGk8ZrEKbs_9-CfLInkAnA",
    authDomain: "blms-77678.firebaseapp.com",
    projectId: "blms-77678",
    storageBucket: "blms-77678.appspot.com",
    messagingSenderId: "290579634625",
    appId: "1:290579634625:web:20773d921df5647e3cb740",
    measurementId: "G-EC6EEJN75G"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getFirestore()
// setPersistence(auth, browserLocalPersistence)
//   .then(() => {
//     // Existing and future Auth states are now persisted in the current
//     // session only. Closing the window would clear any existing state even
//     // if a user forgets to sign out.
//     // ...
  
//   })
//   .catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
    
//   });
  
export const registerUserToFirestore  = (docUID,data) =>{


    const docRef = doc(db, 'users',docUID)
    setDoc(docRef,data)
  }

  export const logObjects  = (cameraUID:string,cameraData:{
    name:string,
    created:FieldValue,
    location:string,
  },objectUID:string,objectData:{
    bbox:Array<number>,
    class:string,
    score:number,
    created:FieldValue,
  }) =>{
 
      const cameraRef = doc(db, 'cameras',cameraUID)
      setDoc(cameraRef,cameraData)
      const objectRef = collection(cameraRef,objectUID)
      addDoc(objectRef,objectData)
    

  }


  export const googleSignup =()=> signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });