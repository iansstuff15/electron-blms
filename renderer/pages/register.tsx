import AppLayout from "../components/layout";
import { Button, Card, Checkbox, Col, Divider, Form, Input, InputNumber, List, Menu, MenuProps, Row, Space, Statistic } from 'antd';
import styles from '../styles/home.module.scss'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import Line from "../components/charts/line";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEventHandler, useEffect, useState } from "react";
import { UserCredential, createUserWithEmailAndPassword } from "firebase/auth";
import {  notification, } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

import { auth, db, registerUserToFirestore, googleSignup } from '../firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { GetStaticProps } from "next/types";
import { ipcRenderer } from 'electron';

export const getStaticProps: GetStaticProps = async () => {
    
  const res = await fetch(`https://api.unsplash.com/photos/random?client_id=YvaQunI3D9W9HBiG3yFx3J2tlbpmmT2-LWe5ADjzST4&query=bike&count=1`)
  const imageData = await res.json()

  return{
    props:{
      imageData
    }
  }
}

const Register: React.FC = ({imageData}:{imageData: any}) => {
  console.log(imageData)
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
const [firstName,setFirstName] = useState('')
const [lastName,setLastName] = useState('')
const [phone,setPhone] = useState(0)
const [loading,setLoading] =useState(false)
const ipc = ipcRenderer
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
  
        <div className={styles.content} style={{backgroundColor:'white', overflowY:'scroll', height:'100vh'}}>
     
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
      <br/>
      <h1>Join us!</h1>
      <h3 style={{color:'#c5c5c5', fontWeight:'400'}}>Register to continue</h3>
   <br/>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
        
      >
        <Input type="email"  onChange={(e)=>{setEmail(e.target.value)}}/>
      </Form.Item>
      <Form.Item
        label="First name"
        name="firstName"
        rules={[{ required: true, message: 'Please input first name' },{min:3,message:'first name must alteast be 3 characters long'}]}
      >
        <Input onChange={(e)=>{setFirstName(e.target.value)}}/>
      </Form.Item>
      <Form.Item
        label="Last name"
        name="lastName"
        rules={[{ required: true, message: 'Please input last name' },{min:3,message:'last name must alteast be 3 characters long'}]}
      >
        <Input onChange={(e)=>{setLastName(e.target.value)}}/>
      </Form.Item>
      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: 'Please input phone' },{len:11,message:'length of phone must be 11'},]}
      >
        <Input type="number" style={{width:'100%'}} onChange={(e)=>{
          setPhone(parseInt(e.target.value))
        }} />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' },{min:6,message:'first name must alteast be 3 characters long'}]}
      >
        <Input.Password onChange={(e)=>{setPassword(e.target.value)}}/>
      </Form.Item>
      <Form.Item >
        <Button type="text"  onClick={()=>router.push('/forgetpassword')} >
          Forgot Password
        </Button>
      </Form.Item>
      <Form.Item >
        <Button type="primary" block htmlType="submit" loading={loading} disabled={loading} onClick={async()=>{
        setLoading(true);
        await createUserWithEmailAndPassword(auth, email, password)
        .then(async(userCredential:UserCredential) => {
          // Signed in 
          const user = await userCredential.user;
          const uid = await user.uid
          await registerUserToFirestore(uid,{
            firstName: firstName,
            lastName: lastName,
            email: email,
            emailVerified:false,
            phoneVerified:false,
            phone:phone,
            created: serverTimestamp(),
            modified: serverTimestamp()
          })
        
          openNotificationWithIcon('success', 'Registration Success', 'Logging you in')
          router.push('home')
          setLoading(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          openNotificationWithIcon('error', errorCode,errorMessage)
          setLoading(false);
        });
        }}>
          <strong>
          Register
          </strong>
        </Button>
      </Form.Item>
      {/* <Divider style={{color:'#c5c5c5', fontWeight:'400'}}>other options</Divider>
      <Form.Item >
        <Button  block >
        <Image style={{width:'100%', height:'100%', objectFit:'cover',marginTop:'.04rem'}} src={'/google.svg'} width={15} height={15} alt={"logo"}/>
        <strong style={{marginLeft:'.3rem'}} onClick={()=>{
          googleSignup()
        }}>Register in with Google</strong>
        </Button>
      </Form.Item> */}
  
      <Form.Item >
        <Button type="text" onClick={()=>{
          
          router.push('/home')}}>
          Dont have an account yet? <strong  onClick={()=>{router.push('/home')}}> Login!</strong>
        </Button>
      </Form.Item>
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

export default Register;
