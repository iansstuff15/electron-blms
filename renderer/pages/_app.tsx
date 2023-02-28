import type { AppProps } from "next/app";

import "../style.css";
import "../App.css";
import React, { useEffect } from "react";
import { ConfigProvider } from "antd";
import en_US from "antd/locale/en_US";
import TitleBar from "../components/titlebar";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";

import { DocumentData, DocumentSnapshot, doc, onSnapshot } from "firebase/firestore";
// This default export is required in a new `pages/_app.js` file.


import { proxy, useSnapshot } from 'valtio'
import { ipcRenderer } from 'electron';

export const state = proxy({ 
email:'',
emailVerified:false,
phoneVerified:false,
firstName:'',
lastName:'',
phone: 0,
})

export const splashState = proxy({
  shownSplash: false
})

export default function MyApp({ Component, pageProps }: AppProps) {
  const ipc = ipcRenderer
  const snap = useSnapshot(state);
  const splash = useSnapshot(splashState)
  const router = useRouter();
  type ThemeData = {
    borderRadius: number;
    colorPrimary: string;
  };
  
  const defaultData: ThemeData = {
    borderRadius: 8,
    colorPrimary:'#0e5482',
  
    
  };
  
  const [data, setData] = React.useState<ThemeData>(defaultData);

  useEffect(()=>{

    onAuthStateChanged(auth, (user) => {
      if (user) {
       
        const uid = user.uid;
 
        console.log(uid)
        console.log(user)
        const unsub = onSnapshot(doc(db, "users", uid), (doc) => {
          console.log("Current data: ", doc.data());
          state.firstName = doc.data().firstName
          state.lastName = doc.data().lastName
          state.email = doc.data().email
          state.phone = doc.data().phone
          state.phoneVerified = doc.data().phoneVerified
          state.emailVerified = user.emailVerified
      });

        router.replace('/welcome')
       
      } else {
        router.replace('/home')
     
      }
    });
  
  },[])

  return <ConfigProvider
  locale={en_US}
  theme={{ token: { colorPrimary: data.colorPrimary, borderRadius: data.borderRadius, colorTextPlaceholder:"inherit",  } }}
>

<Component {...pageProps} />
  </ConfigProvider>;
}
