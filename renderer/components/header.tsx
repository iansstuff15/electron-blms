import { Avatar, Input, Layout, Menu, MenuProps, } from "antd";
import { MdSettings } from "react-icons/md";
import { RiNotification3Fill } from "react-icons/ri";
import Image from 'next/image';
import { useState } from "react";
const { Search } = Input;
const { Header, } = Layout;
import styles from '../styles/components/layout.module.scss'
import { UserOutlined } from '@ant-design/icons';
import {HiDocumentText} from 'react-icons/hi'
import { AntDesignOutlined } from '@ant-design/icons';
import { Empty } from 'antd';
import { Slider } from 'antd';
import type { DrawerProps, RadioChangeEvent } from 'antd';
import { Switch } from 'antd';
import { Button, Drawer, Radio, Space } from 'antd';
import {FaUserCircle} from 'react-icons/fa'
import { useRouter } from 'next/router';
import {IoAppsSharp} from 'react-icons/io5'
import { AiOutlineSearch } from "react-icons/ai";
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useSnapshot } from "valtio";
import { state } from "../pages/_app";
import { ipcRenderer } from "electron";
const AppHeader:React.FC = () =>{
  const snap = useSnapshot(state);
  const router = useRouter()
    const [openNotifications, setOpenNotifications] = useState(false);
    const [openSettings, setOpenSettings] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [openDocuments, setDocuments] = useState(false);
    const [maximized, setMaximized] = useState(false)
    const [placement, setPlacement] = useState<DrawerProps['placement']>('right')
   
   
    const onSearch = (value: string) => console.log(value);
  const ipc = ipcRenderer
  const items: MenuProps['items'] = [
    // {
    //   label: 'Reports',
    //   key: 'Reports',
    //   onClick:()=>{setDocuments(true)},
    //   icon: 
      
    //   <HiDocumentText size={20} />,
    // },
      {
        label: 'Notifications',
        key: 'Notifications',
        onClick:()=>{setOpenNotifications(true)},
        icon: 
        
        <RiNotification3Fill size={20} />,
      },
      
      // {
      //     label: 'Settings',
      //     key: 'Settings',
      //     onClick:()=>{setOpenSettings(true)},
      //     icon: <MdSettings size={20} />,
      //   },
      {
          label: `${snap.firstName}`,
          key: `Profile`,
          onClick:()=>{setOpenProfile(true)},
          icon:   <Avatar size={20 } icon={<Image layout='fill' src={`https://api.dicebear.com/5.x/initials/svg?seed=${snap.firstName}%20${snap.lastName}`} />} />,
         
        },
        {
         
          key: `minimize`,
          onClick:()=>{
            ipc.send('minimize')},
          icon:  <Image src={'/minimize.svg'} width={10} height={10} style={{width:10, height:10}}/>,
         
        },
        {
    
          key: `maximize`,
          onClick:()=>{
            ipc.send('maximize')
          },
          icon:    <Image src={`${maximized? "/maximize2.svg":"/maximize.svg"}`} width={10} height={10}  style={{width:10, height:10}}/>,
         
        },
        {
       
          key: `close`,
          onClick:()=>{
            ipc.send('closeApp')
          },
          icon:    <Image src={'/close.svg'}  width={10} height={10} style={{width:10, height:10}}/>,
         
        },
  
    ]; 
    return(
      <Header className={styles.header}
        
      style={{
          backgroundColor:'#f5f5f4',
          color:'black',
      }}
      >
        <div className={styles.menuLogoContainer}>
        
          {/* <div>
   
          <Image src={'/logo.png'} width={300} height={300} alt={"logo"}/> 
          </div> */}
          </div>
       
        
        {/* <Input placeholder="Search feature" suffix={<AiOutlineSearch/>} bordered={false} color={'blue'} 
        
        style={{
           
            backgroundColor:"#edebeb"
          

          }} /> */}
        
        <Menu mode="horizontal"  selectedKeys={[]} style={{backgroundColor:'#f5f5f4',minWidth: 'max-content'}}  className={styles.top_menu}  items={items}/>
        {/* <div className={styles.top_menu}>
          <span onClick={()=>{setOpenNotifications(true)}}> <RiNotification3Fill size={20} />Notifcations</span>
          <span onClick={()=>{setOpenSettings(true)}}><MdSettings size={20} />Settings</span>
          <span onClick={()=>{setOpenProfile(true)}}> <Avatar size={30 } icon={<Image layout='fill' src={`https://api.dicebear.com/5.x/initials/svg?seed=${snap.firstName}%20${snap.lastName}`} />}/>
          <strong style={{
             whiteSpace: "nowrap",
             width: "100%",
             overflow: "hidden",
             textOverflow: "ellipsis"
          }}>
            {snap.firstName}
          </strong>
          </span>
          <span>
          <Button type='ghost'>
            <Image src={'/minimize.svg'} layout="fill" style={{width:10, height:10}}/>
          </Button>
          </span>
          <span>
          <Button  type='ghost'>
          <Image src={'/maximize.svg'} layout="fill"/>
          </Button>
          </span>
          <span>
          <Button  type='ghost'>
          <Image src={'/close.svg'} layout="fill"/>

          </Button>
          </span>
        </div> */}
        <Drawer
      title="Notifications"
      placement={placement}
      closable={false}
      onClose={()=>{
        setOpenNotifications(false)
      }}
      open={openNotifications}
      key={placement+'Notifications'}
    >
      <div>
      <Empty
 
  description={
    <span>
       <a href="#API">Opps... no new notification</a>
    </span>
  }
/>
  

      </div>
      <br/>
      <Button type="primary" block  size='large' disabled>Clear all</Button>
    </Drawer>
    <Drawer
      title="Settings"
      placement={placement}
      closable={false}
      onClose={()=>{
        setOpenSettings(false)
      }}
      open={openSettings}
      key={placement+'Settings'}
    >
     <div>
      <h3>Dark mode</h3>
      <Switch onChange={()=>{}} />
      
      <h3>Font Size</h3>
      <Slider defaultValue={30}  />
     </div>
     <Button type="primary"  size='large' disabled>Save changes</Button>
    </Drawer>
    <Drawer
      title="Profile"
      placement={placement}
      closable={false}
      onClose={()=>{
        setOpenProfile(false)
      }}
      open={openProfile}
      key={placement+'Profile'}
     

    >
      <div className={styles.profile_info}>

      <Avatar size={100 } icon={<Image layout='fill' src={`https://api.dicebear.com/5.x/initials/svg?seed=${snap.firstName}%20${snap.lastName}`} />} />
      <div>
        <h2>{snap.lastName}, {snap.firstName}</h2>
      </div>
     
     </div>
     <br/>
     <Button type="primary" block size='large' onClick={()=>{
      signOut(auth)
     }}>Logout</Button>
    </Drawer>
    <Drawer
      title="Reports"
      placement={placement}
      closable={false}
      onClose={()=>{
        setDocuments(false)
      }}
      open={openDocuments}
      key={placement+'Reports'}
    >
      <div>
     <Empty
 
      description={
        <span>
            <a href="#API">Opps... no documents available</a>
        </span>
      }
    />
     </div>
     <Button type="primary" size='large' disabled>Generate</Button>
    </Drawer>
      </Header>
    )
}

export default AppHeader