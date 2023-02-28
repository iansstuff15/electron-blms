import { Avatar, Button, Layout, Menu, MenuProps } from "antd"
import { useRouter } from "next/router";
const {  Sider } = Layout;
import { BsFillPersonFill } from "react-icons/bs";

import { MdSpaceDashboard, MdWork } from "react-icons/md";

import { SidebarProps } from '../interface';

import Image from "next/image";
import { useState } from "react";
import { useSnapshot } from 'valtio';
import { state } from '../pages/_app';
const SideBar:React.FC<SidebarProps> = ({highlight}) => {
  const snap = useSnapshot(state)
    const router =useRouter()
    const items: MenuProps['items'] = [
        {
          label: 'Dashboard',
          key: '/dashboard',
          onClick:()=>router.push('/dashboard'),
          style:{
            padding:'.2rem'
          },
          icon: <MdSpaceDashboard size={20} />,
        },
        {
          label: 'Cameras',
          key: '/cameras',
          onClick:()=>router.push('/cameras'),

          style:{
            padding:'.2rem'
          },
          icon: <BsFillPersonFill size={20} />,
          
        },
    
    
      ];
    const [collapsed, setCollapsed] = useState(true);
    return(
      <Sider  width={240} 
      onMouseEnter={()=>setCollapsed(false)}
      onMouseLeave={()=>{setCollapsed(true)}}
      theme="light"  className="site-layout-background"
       collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
      
      style={{
        padding:'1 rem',
        backgroundColor:"#f5f5f4",
        borderRight:".01rem solid #b1b4b6"
      }}
      >
        <div style={{padding:' 1.5rem',}}>
  <Image    src={'/logo.png'} width={20} height={18 } alt={"logo"}/> 

        </div>
    
     
      <Menu
        mode="inline"
        defaultSelectedKeys={[highlight]}
        
        style={{ 
        height: '100%', 
        backgroundColor:"#f5f5f4",
        padding:'.5rem'

      }}
      theme={
        'light'
      }
        items={items}
      />
    </Sider>
    )
}

export default SideBar