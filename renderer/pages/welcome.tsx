import AppLayout from "../components/layout";
import { Avatar, Button, Card, Checkbox, Col, Divider, Form, Input, List, Menu, MenuProps, Row, Space, Statistic, Switch } from 'antd';
import styles from '../styles/home.module.scss'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import Line from "../components/charts/line";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IpcMain, ipcRenderer } from "electron";
import { GetStaticProps } from "next";
import { sendEmailVerification, sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from "../firebase";
import {  notification, } from 'antd';
import { useSnapshot } from "valtio";
import { state } from "./_app";



type NotificationType = 'success' | 'info' | 'warning' | 'error';
export const getStaticProps: GetStaticProps = async () => {
   
 
  const res = await fetch(`https://api.unsplash.com/photos/random?client_id=YWiBDz8ljyH4wbPbewLjPY3Ix_TAldasb51R30krh00&query=bike&count=1`)
  const imageData = await res.json()

  return{
    props:{
      imageData
    }
  }
}

const Welcome: React.FC =  ({imageData}:{imageData: any}) => {
  const ipc = ipcRenderer
  const snap = useSnapshot(state);
  const [isLoadingLogout, setIsLoadingLogout] = useState(false)
  const [isLoadingContinue, setIsLoadingContinue] = useState(false)
  const [isLoadingSwitch, setIsLoadingSwitch] = useState(false)

const openNotificationWithIcon = (type: NotificationType, message:string, description:string) => {
  if(type == 'success') {
    notification.success({
      message:message,
      description:description,
    })
  }
  else if (type=='error'){
    notification.error({
      message:message,
      description:description,
    })
  }
};
const router = useRouter()
const [email,setEmail] = useState('')
const [password,setPassword] = useState('')
const [loading,setLoading] =useState(false)

const items: MenuProps['items'] = [

  {
   
    key: `minimize`,
    onClick:()=>{
      ipc.send('minimize')},
    icon:  <Image src={'/minimize.svg'} width={10} height={10} style={{width:10, height:10}}/>,
   
  },
 
  {
 
    key: `close`,
    onClick:()=>{
      ipc.send('closeApp')
    },
    icon:    <Image src={'/close.svg'}  width={10} height={10} style={{width:10, height:10}}/>,
   
  },

]; 

  return (

    <div style={{display:'grid', gridTemplateColumns:'.5fr 1fr', minHeight:"100vh",}}>

      <div style={{backgroundColor:'white'}}>
      <div  className={styles.title_bar}>
          <Menu style={{
            backgroundColor:'transparent',
            minWidth:'max-content'
          }} mode="horizontal" items={items}/>
        </div>
       

      <div
    
   
    style={{ maxWidth: "100%" ,padding:'1rem 4.5rem'}}

  >
    <Image src={"/logo.png"} width={50} height={15}/>
    
    
    {
      snap.emailVerified?
      <>
       <br/>
       <br/>
     
    <h2>WELCOME BACK</h2>
    <br/>
      
    <Space direction="vertical" align="center" size="middle" style={{ display: 'flex' }}>
    <Avatar size={150 } icon={<Image layout='fill' src={`https://api.dicebear.com/5.x/initials/svg?seed=${snap.firstName}%20${snap.lastName}`} />} />
    <h3 style={{textAlign:'center'}}>{snap.lastName}, {snap.firstName}</h3>
 
     </Space>
     <br/>
     <Space direction="vertical"  size="middle" style={{ display: 'flex' }}>
  
    <Button type="primary" block loading={isLoadingContinue} disabled={isLoadingContinue}
    onClick={()=>{
      setIsLoadingContinue(true)
      router.push('/dashboard')
      
    }}
    ><strong>Continue</strong> </Button>
    <Button type="default" block loading={isLoadingSwitch} disabled={isLoadingSwitch} onClick={()=>{
    setIsLoadingSwitch(true)
    router.push('/home')

    }} ><strong>Switch Account</strong></Button>
    <Button type="text" block loading={isLoadingLogout} disabled={isLoadingLogout} 
    onClick={()=>{
      setIsLoadingLogout(true)
      signOut(auth)
      router.push('/home')
    }}

    ><strong>Logout</strong></Button>
     </Space>
  
      </>
      :
      <>
      <br/>
      <br/>
      <Space direction="vertical" size="large"  style={{ display: 'flex' }}>
      <h2>OPPS EMAIL NOT VERIFIED</h2>
      <Button type="primary"
      onClick={()=>{
        sendEmailVerification(auth.currentUser)
        openNotificationWithIcon("success", "Verification sent", "Please check your inbox to verify your email")
        router.push('/home')
      }}
      block>Verify {snap.email}</Button>
      <Button onClick={()=>{
        signOut(auth)
      }} block>Switch Account</Button>
      </Space>
      </>
    }
   
  </div>
      </div>
 

      <div style={{
   
   
   backgroundImage:`url("${imageData[0].urls.regular}")`,
  backgroundRepeat:"no-repeat",
  backgroundPosition:"center",
      backgroundSize:'cover',
}}>
      </div>


</div>
  );
};

export default Welcome;
