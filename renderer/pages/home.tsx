import AppLayout from "../components/layout";
import { Avatar, Button, Card, Checkbox, Col, Divider, Form, Input, List, Menu, MenuProps, Row, Space, Statistic } from 'antd';
import styles from '../styles/home.module.scss'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import Line from "../components/charts/line";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IpcMain, ipcRenderer } from "electron";
import { GetStaticProps } from "next";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import {  notification, } from 'antd';
import { doc, onSnapshot } from "firebase/firestore";
import { state } from "./_app";
import { useSnapshot } from "valtio";



type NotificationType = 'success' | 'info' | 'warning' | 'error';

export const getStaticProps: GetStaticProps = async () => {
  
  const res = await fetch(`https://api.unsplash.com/photos/random?client_id=YvaQunI3D9W9HBiG3yFx3J2tlbpmmT2-LWe5ADjzST4&query=bike&count=1`)
  const imageData = await res.json()

  return{
    props:{
      imageData
    }
  }
}

const App: React.FC = ({imageData}:{imageData: any}) => {
  const ipc = ipcRenderer
  const snap = useSnapshot(state);
  const [userLoginLoading,setUserLoginLoading] = useState(false)
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
useEffect(()=>{
  ipc.send('accountContent')
})
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

    <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', minHeight:"100vh",}}>

      <div style={{backgroundColor:'white'}}>
        <div  className={styles.title_bar}>
          <Menu style={{
            backgroundColor:'transparent',
            minWidth:'max-content'
          }} mode="horizontal" items={items}/>
        </div>
      

      <Form
    name="basic"
    layout="vertical"
   
    style={{ maxWidth: "100%" ,padding:'1rem 4.5rem'}}
    initialValues={{ remember: true }}
    onFinish={()=>{

    }}
    onFinishFailed={()=>{

    }}
    autoComplete="off"
  >
   <Image src={"/logo.png"} width={50} height={15}/>
    <br/>
    <br/>
    <h1>Welcome back</h1>
    <h3 style={{color:'#c5c5c5', fontWeight:'400'}}>Login to continue</h3>
 <br/>
    <Form.Item
      label="Email"
      name="email"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input onChange={(e)=>{setEmail(e.target.value)}}/>
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password onChange={(e)=>{setPassword(e.target.value)}}/>
    </Form.Item>
    <Form.Item >
      <Button type="text" onClick={()=>router.push('/forgetpassword')} >
        Forgot Password
      </Button>
    </Form.Item>
    <Form.Item >
      <Button type="primary" block htmlType="submit"
      loading={loading}
      disabled={loading}
      onClick={()=>{
         setLoading(true)
         signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          openNotificationWithIcon('success', "Login Success",`Welcome back ${user.email}`)
          setLoading(false)
      
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          openNotificationWithIcon('error', errorCode,errorMessage)
          setLoading(false)
          // ..
        });
        //  router.push('/dashboard')
       
      }}>
        <strong>
        Login
        </strong>
      </Button>
    </Form.Item>
    {/* <Divider style={{color:'#c5c5c5', fontWeight:'400'}}>other options</Divider>
    <Form.Item >
      <Button  block htmlType="submit">
      <Image style={{width:'100%', height:'100%', objectFit:'cover',marginTop:'.04rem'}} src={'/google.svg'} width={15} height={15} alt={"logo"}/>
      <strong style={{marginLeft:'.3rem'}} >Login in with Google</strong>
      </Button>
    </Form.Item> */}

    <Form.Item >
      <Button type="text" onClick={()=>{
       router.push('/register')
        }}>
        Dont have an account yet? <strong  onClick={()=>{
          router.push('/register')
        }}> Register!</strong>
      </Button>
    </Form.Item>

      {
        snap.email && snap.emailVerified?
        <>
        <Divider>or login with signed in user</Divider>
        <Button
        loading={userLoginLoading}
        disabled={userLoginLoading}
        style={{padding:'.5rem', height:'3rem'}} onClick={()=>{
        setUserLoginLoading(true)
        router.push('/welcome')
        
        }}   type="default" block  icon={
          <Avatar size={30 } icon={<Image layout='fill' src={`https://api.dicebear.com/5.x/initials/svg?seed=${snap.firstName}%20${snap.lastName}`} />} />
        } >
             <strong style={{padding:'.3rem'}}>{snap.lastName}, {snap.firstName}</strong>
          </Button>
        </>
        :
        null
      }
      
   
  </Form>
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

export default App;
