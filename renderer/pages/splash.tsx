import { useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { Space, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from '../styles/pages/splash.module.scss'
import Image from 'next/image';

const Splash = () => {
    const ipc = ipcRenderer
    useEffect(()=>{
        
        ipc.send('splash')

        
    },[])
    return(
        <div className={styles.container} style={{
            padding:'3rem 4rem',
            textAlign:'center'
        }}>
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Image src={'/logo.png'} width={150} height={70}/>
            <h3>BIKE LANE MONITORING SYSTEM</h3>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />} />    
            </Space>
            
        </div>
    )
}

export default Splash