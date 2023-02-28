import { Layout } from 'antd';
import React, { ReactNode } from 'react';
import styles from '../styles/components/layout.module.scss'

const {  Content } = Layout;


import SideBar from './sidebar';
import AppHeader from './header';

export interface LayoutProps{
  children: ReactNode,
  location: string
}
const AppLayout: React.FC<LayoutProps> = ({children,location}) =>{ 
   
    return(

  <>

      
  <Layout style={{ minHeight: '100vh' }}>
  {
        location!='404'?
        <SideBar highlight={location}/>
        :
        null
      }
      
      <Layout className="site-layout">
      <AppHeader/>
      <Content
          // className={styles.site_layout_background}
          style={{
           
            margin: 0,
            overflowY:'scroll',
            height:'90vh',
            padding:'1rem ',
            backgroundColor:"#f5f5f4"
          }}
        >
         
            {
                children
            }
        </Content>
      </Layout>
    </Layout>
  </>
  
);}

export default AppLayout;