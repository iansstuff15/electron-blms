import AppLayout from "../components/layout";
import { Button, Card, Checkbox, Col, Divider, Form, Input, List, Menu, MenuProps, Row, Space, Statistic } from 'antd';
import styles from '../styles/home.module.scss'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import Line from "../components/charts/line";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IpcMain, ipcRenderer } from "electron";
import { GetStaticProps } from "next";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import {  notification, } from 'antd';

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

const App: React.FC =  ({imageData}:{imageData: any}) => {

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
    <br/>
    
    <h1>Forget Password</h1>
 <br/>
    <Form.Item
      label="Email"
      name="email"
      rules={[{ required: true, message: 'Please input your email!' }]}
    >
      <Input onChange={(e)=>setEmail(e.target.value)}/>
    </Form.Item>

  
    <Form.Item >
      <Button type="primary" block htmlType="submit" onClick={()=>{
         setLoading(true)
         sendPasswordResetEmail(auth, email)
        .then(() => {
          openNotificationWithIcon('success',"Verification email sent","Please check your email")
          router.push('/home')
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          openNotificationWithIcon('error',errorCode,errorMessage)
        });
         setLoading(false)
      }}>
        <strong>
      Send Verification
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
       router.push('/home')
        }}>
        Remembered your account? <strong  onClick={()=>{
          router.push('/home')
        }}> Login!</strong>
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

export default App;
