import AppLayout from "../components/layout";
import { Card, Col, List, Row, Space, Statistic } from 'antd';
import styles from '../styles/home.module.scss'
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import Line from "../components/charts/line";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ipcRenderer } from 'electron';
const Dashboard =()=>{
    const ipc = ipcRenderer
    const router = useRouter()
    useEffect(()=>{
      ipc.send('mainContent')
      
    })
    return (
  <AppLayout location={router.pathname}>
    <div>
  
    </div>
    <Card style={{margin:"1rem 0"}}>
    <h1>Yearly growth of each report type</h1>
    <Line/>
    </Card>
    <Card style={{margin:"1rem 0"}}>
    <Row gutter={16}>
      <Col >
        <Statistic title="Year to Date Report" value={112893} />
      </Col>
      <Col>
        <Statistic title="Monthly Reports" value={1193} />
      </Col>
      <Col >
        <Statistic title="Daily Reports" value={112}  />
      </Col>
    </Row>
    </Card>
   
    <Row gutter={16}>
      <Col span={12}>
        <Card bordered={false}>
          <Statistic
            title="Active"
            value={11.28}
            precision={2}
            valueStyle={{ color: '#3f8600' }}
            prefix={<ArrowUpOutlined />}
            suffix="%"
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card bordered={false}>
          <Statistic
            title="Idle"
            value={9.3}
            precision={2}
            valueStyle={{ color: '#cf1322' }}
            prefix={<ArrowDownOutlined />}
            suffix="%"
          />
        </Card>
      </Col>
    </Row>
  
    <Card style={{margin:"1rem 0"}}>
    <h1>Recent Report</h1>
      <List/>
    </Card>
  </AppLayout>
    );
}

export default Dashboard