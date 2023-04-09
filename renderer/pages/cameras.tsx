import AppLayout from "../components/layout";
import * as tf from '@tensorflow/tfjs';
import { Avatar, Button, Card, Col, DatePicker, DatePickerProps, List, Row, Segmented, Space, Statistic, Timeline } from 'antd';
import styles from '../styles/home.module.scss'
import Webcam from "react-webcam";
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { EditOutlined,EllipsisOutlined,SettingOutlined } from '@ant-design/icons';
import Line from "../components/charts/line";
import { useRouter } from "next/router";
import * as cocossd from '@tensorflow-models/coco-ssd'
import { useEffect, useRef, useState } from "react";
import { drawRect } from "../components/utilities";
import dynamic from 'next/dynamic';
import { DocumentData, DocumentSnapshot, doc, onSnapshot, FieldValue, collection } from 'firebase/firestore';
import { db } from "../firebase";
import dayjs from 'dayjs';
import { CSVLink, CSVDownload } from "react-csv";
const Meta = dynamic(() => import('antd/es/card/Meta'), {
  ssr: false,
}) ;
const App: React.FC = () => {
const webcamRef = useRef(null)
const canvasRef = useRef(null)
const [cameraInfo,setCameraInfo] = useState<DocumentData>()
const [objectInfo,setObjectInfo] = useState<DocumentData[]>()
const [personCount,setPersonCount] = useState(0)
const [bicycleCount,setBicycleCount] = useState(0)
const [motorcycleCount,setMotorcycleCount] = useState(0)
const [carsCount,setCarsCount] = useState(0)


const now = new Date()
const [currentDate, setCurrentDate] = useState('')
const runCoco = async()=>{
  const network = await cocossd.load();
  setInterval(()=>{
    detect(network)
  },10)
}

const detect = async(network: cocossd.ObjectDetection) =>{
  if (
    typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4
  ) {
    // Get Video Properties
    const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set video width
    webcamRef.current.video.width = videoWidth;
    webcamRef.current.video.height = videoHeight;

    // Set canvas height and width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Make Detections
    const obj = await network.detect(video);

    // Draw mesh
    const ctx = canvasRef.current.getContext("2d");
    drawRect(obj, ctx); 
  }
}
const cameraRef = doc(db, 'cameras',"Camera 1")
const objectRef = collection(cameraRef, `2023-3-23`)
const onChangeDatePicker: DatePickerProps['onChange'] = (date, dateString) => {
  
  
  setCurrentDate(dateString)
  console.log("currentDate")
  console.log(currentDate)
};
useEffect(()=>{
  tf.setBackend('gpu');
  console.log(tf.getBackend());
 
  onSnapshot(cameraRef, (doc) => {
    let tempData:DocumentData
    console.log("Current data: ", doc.data());
 
    tempData=doc.data()
    setCameraInfo(tempData)
    console.log("Camera Info")
    console.log(cameraInfo)
});

onSnapshot(objectRef, (doc) => {

  console.log("Object Info")
   const tempData =doc.docs.map((doc) =>doc.data())
   console.log("tempData")
     console.log(tempData)
  setObjectInfo(tempData?tempData
    // .filter((data) => currentDate == `${data.created.toDate().getMonth( )>9? '':0}${data.created.toDate().getMonth( )+1 }-${data.created.toDate().getDate() }-${data.created.toDate().getFullYear()}`) 
    : [])

 setPersonCount( tempData.filter((data) => data.class == "person" 
//  && currentDate == currentDate?currentDate:`${data.created.toDate().getMonth( )>9? '':0}${data.created.toDate().getMonth( )+1 }-${data.created.toDate().getDate() }-${data.created.toDate().getFullYear()}`
 ).length 
 )
 setBicycleCount( tempData.filter((data) => data.class == "bicycle" 
//  && currentDate == `${data.created.toDate().getMonth( )>9? '':0}${data.created.toDate().getMonth( )+1 }-${data.created.toDate().getDate() }-${data.created.toDate().getFullYear()}`
 ).length)
 setCarsCount( tempData.filter((data) => data.class == "car"
  // && currentDate == `${data.created.toDate().getMonth( )>9? '':0}${data.created.toDate().getMonth( )+1 }-${data.created.toDate().getDate() }-${data.created.toDate().getFullYear()}`
  ).length)
 setMotorcycleCount( tempData.filter((data) => data.class == "motorcycle"
  // && currentDate == `${data.created.toDate().getMonth( )>9? '':0}${data.created.toDate().getMonth( )+1 }-${data.created.toDate().getDate() }-${data.created.toDate().getFullYear()}`
  ).length)
 console.log(objectInfo)
 
});


} )
useEffect(()=>{
 
  runCoco()

},[])
const router = useRouter()
  return (
<AppLayout location={router.pathname}>
 
  <Card style={{margin:"1rem 0",height:"fit-content", }} title={'Brgy. Hall/ L. Jaena Camera 1'}>
  <Row>
    <Col span={18} push={6}>
      
    <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 2,
            width: 640,
            height: 480,
          }}
        />
    <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 1,
            width: 640,
            height: 480,
           
          }}
        />

    
    </Col>
    <Col span={6} pull={18}>
 
  <Space direction="vertical" size="middle" style={{ display: 'flex' }} >
  <h3>Daily Statistics</h3>
    <Segmented block defaultValue={"Objects"} options={['Objects','Violations']} />

    <Row gutter={16}>
    <Col span={12}>
      <Statistic title="Bicycle" value={bicycleCount}/>
    </Col>
    <Col span={12}>
      <Statistic title="Cars" value={carsCount}  />
    </Col>
    <Col span={12}>
      <Statistic title="Persons" value={personCount}  />
    </Col>
    <Col span={12}>
      <Statistic title="Motorcycle" value={motorcycleCount}  />
    </Col>
  </Row>
  {/* <h4>Filter</h4>
  <DatePicker defaultValue={dayjs(now)} style={{width:"100%"}} format={"MM-DD-YYYY"} onChange={onChangeDatePicker} /> */}

  <Timeline
  style={{
    overflowY:'scroll',
    overflowX:'hidden',
    height:'40vh',
    width:'100%',
    fontSize:'.4rem'
  }}
    mode={"left"}
    items={  objectInfo? objectInfo.map((data)=>{return({
      label: `${data.created.toDate().getMonth( )+1 }/${data.created.toDate().getDate() }/${data.created.toDate().getFullYear()}  ${data.created.toDate().getHours() }:${data.created.toDate().getMinutes() }`,
      children: data.class
    })}):[]
  }
  />
  <Button type="primary"  block>
  <CSVLink filename='camera1.csv' data={  objectInfo? objectInfo.map((data)=>{return({
      label: data.created? `${data.created.toDate().getMonth( )+1 }/${data.created.toDate().getDate() }/${data.created.toDate().getFullYear()}  ${data.created.toDate().getHours() }:${data.created.toDate().getMinutes() }` : null,
      children: data.class
    })}):[]
  }> Generate report</CSVLink>
  </Button>
  </Space>
 
    </Col>
  </Row>

  </Card>
    <h3>Other Cameras</h3>

    <Space size={[8, 16]} wrap>
    <Card
    style={{ width: 300 }}
    cover={
      <video autoPlay loop >
      <source src="https://blms-videos.s3.ap-southeast-1.amazonaws.com/1_1.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0xIkYwRAIgIRrR6uk6ba40luSh6HSk%2BoM1n83gkn0tuHHzrZqNvAcCIA4yVQ5ysEzQ27T1KOf9d5ffguDyPiN5VcUF%2FsJduIduKoUDCGoQABoMMzU5NDg5MzQyOTQ2Igx4czvG6JjKBom2QEQq4gIuB%2F3He8RMRpCh2nu18OIcuAsHkwJiy3jGyc%2FSAouelMfbb8fWGgrWcZ95UMMHNr4d9QUU6YEzkluENeBRIx4%2Fpw%2FX8APw%2F2uixsye2%2FZ9TMI1kNpQclLIXqpdfZWioegp4%2FPkvoDN%2FA%2BGQAfhfY8RTTSAqA09bCtL1dBIiZLBP5DmoKp9Mf%2FJ6NbXEKrFDDxFaBhFOQlvZ5ZSDPzUO4D0OQp5mmJB3HiymNBWdRCYhOo18sdl9K7XXfdjRVdUSI8guCJrrId60G9zl5Wb5mAkN6stpDUFYb%2Bly5z0c73b7wxI5GGptNetdJmu4LmA2A4fP%2Fc1CmLRVHODqon3C8JXfCUPtpo6nGSmfQAJ8DGiCYZvTgrun3tGGsaSdzDivSSV8AGVsqvv8WHyOi9PfALirKKn%2FHAE2o4MbTu8RZqCvG5apBI%2FU2owzUhRNBGnGK4pAvQgmRCgY%2Fj6QAiyrCwB%2FGcwrpj1nwY6tAI%2FdGQ3hb%2Bivn7oAsoc3Jq4hAIjCFLhAUhs%2FJyIWFTAIJCi6r4w4%2FcueK9uRHWel2Sw8dP0CMBe8acFHYwXJ2VaMCMjlxOkHjdi%2FyC%2BnjB3LustLJZWyXQuD1HBo03jXaZ2xZUfMJngqaBJOgasL1Wq8bWc4vFQxAcpuXJgT94Q5ZCgUFwShJiUYfh0Ybe1GGm01Kf59kmjK6PTRlhM%2BNR66rRT6WKoCsSN3bzejdGjq%2BsNCZK7T%2B4ugeieC72d23kjkU8WiDfT7EuP07M9WopCsKTxdhnD0wdw93Ko0NmMBBlGHQB1N3IDil3u2rH%2BpVVeXajADoXSHc5PPANaUIkupclY8pf0yz%2B%2FS1HtS9j9%2FEU6lasAvjTyWcxch%2Fcgu%2FwhOsinRsF4jDMYA9oytUBl5urtKQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230228T003543Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIAVHMZ4BXRCZLAORPZ%2F20230228%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=f01a844b0b7b59cc339877e63ace3ef0271333d380e0689f259ab378174c10ce" type="video/mp4"/>
    </video>
    }
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      title="Brgy. Hall/ L. Jaena Camera 3"
     
    />
  </Card>
    <Card
    style={{ width: 300 }}
    cover={
      <video autoPlay loop>
      <source src="https://blms-videos.s3.ap-southeast-1.amazonaws.com/2_1.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0xIkYwRAIgIRrR6uk6ba40luSh6HSk%2BoM1n83gkn0tuHHzrZqNvAcCIA4yVQ5ysEzQ27T1KOf9d5ffguDyPiN5VcUF%2FsJduIduKoUDCGoQABoMMzU5NDg5MzQyOTQ2Igx4czvG6JjKBom2QEQq4gIuB%2F3He8RMRpCh2nu18OIcuAsHkwJiy3jGyc%2FSAouelMfbb8fWGgrWcZ95UMMHNr4d9QUU6YEzkluENeBRIx4%2Fpw%2FX8APw%2F2uixsye2%2FZ9TMI1kNpQclLIXqpdfZWioegp4%2FPkvoDN%2FA%2BGQAfhfY8RTTSAqA09bCtL1dBIiZLBP5DmoKp9Mf%2FJ6NbXEKrFDDxFaBhFOQlvZ5ZSDPzUO4D0OQp5mmJB3HiymNBWdRCYhOo18sdl9K7XXfdjRVdUSI8guCJrrId60G9zl5Wb5mAkN6stpDUFYb%2Bly5z0c73b7wxI5GGptNetdJmu4LmA2A4fP%2Fc1CmLRVHODqon3C8JXfCUPtpo6nGSmfQAJ8DGiCYZvTgrun3tGGsaSdzDivSSV8AGVsqvv8WHyOi9PfALirKKn%2FHAE2o4MbTu8RZqCvG5apBI%2FU2owzUhRNBGnGK4pAvQgmRCgY%2Fj6QAiyrCwB%2FGcwrpj1nwY6tAI%2FdGQ3hb%2Bivn7oAsoc3Jq4hAIjCFLhAUhs%2FJyIWFTAIJCi6r4w4%2FcueK9uRHWel2Sw8dP0CMBe8acFHYwXJ2VaMCMjlxOkHjdi%2FyC%2BnjB3LustLJZWyXQuD1HBo03jXaZ2xZUfMJngqaBJOgasL1Wq8bWc4vFQxAcpuXJgT94Q5ZCgUFwShJiUYfh0Ybe1GGm01Kf59kmjK6PTRlhM%2BNR66rRT6WKoCsSN3bzejdGjq%2BsNCZK7T%2B4ugeieC72d23kjkU8WiDfT7EuP07M9WopCsKTxdhnD0wdw93Ko0NmMBBlGHQB1N3IDil3u2rH%2BpVVeXajADoXSHc5PPANaUIkupclY8pf0yz%2B%2FS1HtS9j9%2FEU6lasAvjTyWcxch%2Fcgu%2FwhOsinRsF4jDMYA9oytUBl5urtKQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230228T003621Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIAVHMZ4BXRCZLAORPZ%2F20230228%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=33a8b53959a6b20be175802b54f1061193150062af304a0ff618d126dfe1b44d" type="video/mp4"/>
    </video>
    }
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      title="Brgy. Hall/ L. Jaena Camera 2"
    
    />
  </Card>
  <Card
    style={{ width: 300 }}
    cover={
      <video autoPlay loop >
      <source src="https://blms-videos.s3.ap-southeast-1.amazonaws.com/3_1.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0xIkYwRAIgIRrR6uk6ba40luSh6HSk%2BoM1n83gkn0tuHHzrZqNvAcCIA4yVQ5ysEzQ27T1KOf9d5ffguDyPiN5VcUF%2FsJduIduKoUDCGoQABoMMzU5NDg5MzQyOTQ2Igx4czvG6JjKBom2QEQq4gIuB%2F3He8RMRpCh2nu18OIcuAsHkwJiy3jGyc%2FSAouelMfbb8fWGgrWcZ95UMMHNr4d9QUU6YEzkluENeBRIx4%2Fpw%2FX8APw%2F2uixsye2%2FZ9TMI1kNpQclLIXqpdfZWioegp4%2FPkvoDN%2FA%2BGQAfhfY8RTTSAqA09bCtL1dBIiZLBP5DmoKp9Mf%2FJ6NbXEKrFDDxFaBhFOQlvZ5ZSDPzUO4D0OQp5mmJB3HiymNBWdRCYhOo18sdl9K7XXfdjRVdUSI8guCJrrId60G9zl5Wb5mAkN6stpDUFYb%2Bly5z0c73b7wxI5GGptNetdJmu4LmA2A4fP%2Fc1CmLRVHODqon3C8JXfCUPtpo6nGSmfQAJ8DGiCYZvTgrun3tGGsaSdzDivSSV8AGVsqvv8WHyOi9PfALirKKn%2FHAE2o4MbTu8RZqCvG5apBI%2FU2owzUhRNBGnGK4pAvQgmRCgY%2Fj6QAiyrCwB%2FGcwrpj1nwY6tAI%2FdGQ3hb%2Bivn7oAsoc3Jq4hAIjCFLhAUhs%2FJyIWFTAIJCi6r4w4%2FcueK9uRHWel2Sw8dP0CMBe8acFHYwXJ2VaMCMjlxOkHjdi%2FyC%2BnjB3LustLJZWyXQuD1HBo03jXaZ2xZUfMJngqaBJOgasL1Wq8bWc4vFQxAcpuXJgT94Q5ZCgUFwShJiUYfh0Ybe1GGm01Kf59kmjK6PTRlhM%2BNR66rRT6WKoCsSN3bzejdGjq%2BsNCZK7T%2B4ugeieC72d23kjkU8WiDfT7EuP07M9WopCsKTxdhnD0wdw93Ko0NmMBBlGHQB1N3IDil3u2rH%2BpVVeXajADoXSHc5PPANaUIkupclY8pf0yz%2B%2FS1HtS9j9%2FEU6lasAvjTyWcxch%2Fcgu%2FwhOsinRsF4jDMYA9oytUBl5urtKQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230228T003654Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIAVHMZ4BXRCZLAORPZ%2F20230228%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=200411b2413d9dd1fb5b286a6a7df6ff3b58afdac15fdd6b49bab66731f55e5f" type="video/mp4"/>
    </video>
    }
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      title="Brgy. Hall/ L. Jaena Camera 3"
     
    />
  </Card>
  <Card
    style={{ width: 300 }}
    cover={
      <video autoPlay loop >
      <source src="https://blms-videos.s3.ap-southeast-1.amazonaws.com/4_1.mp4?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEMH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDmFwLXNvdXRoZWFzdC0xIkYwRAIgIRrR6uk6ba40luSh6HSk%2BoM1n83gkn0tuHHzrZqNvAcCIA4yVQ5ysEzQ27T1KOf9d5ffguDyPiN5VcUF%2FsJduIduKoUDCGoQABoMMzU5NDg5MzQyOTQ2Igx4czvG6JjKBom2QEQq4gIuB%2F3He8RMRpCh2nu18OIcuAsHkwJiy3jGyc%2FSAouelMfbb8fWGgrWcZ95UMMHNr4d9QUU6YEzkluENeBRIx4%2Fpw%2FX8APw%2F2uixsye2%2FZ9TMI1kNpQclLIXqpdfZWioegp4%2FPkvoDN%2FA%2BGQAfhfY8RTTSAqA09bCtL1dBIiZLBP5DmoKp9Mf%2FJ6NbXEKrFDDxFaBhFOQlvZ5ZSDPzUO4D0OQp5mmJB3HiymNBWdRCYhOo18sdl9K7XXfdjRVdUSI8guCJrrId60G9zl5Wb5mAkN6stpDUFYb%2Bly5z0c73b7wxI5GGptNetdJmu4LmA2A4fP%2Fc1CmLRVHODqon3C8JXfCUPtpo6nGSmfQAJ8DGiCYZvTgrun3tGGsaSdzDivSSV8AGVsqvv8WHyOi9PfALirKKn%2FHAE2o4MbTu8RZqCvG5apBI%2FU2owzUhRNBGnGK4pAvQgmRCgY%2Fj6QAiyrCwB%2FGcwrpj1nwY6tAI%2FdGQ3hb%2Bivn7oAsoc3Jq4hAIjCFLhAUhs%2FJyIWFTAIJCi6r4w4%2FcueK9uRHWel2Sw8dP0CMBe8acFHYwXJ2VaMCMjlxOkHjdi%2FyC%2BnjB3LustLJZWyXQuD1HBo03jXaZ2xZUfMJngqaBJOgasL1Wq8bWc4vFQxAcpuXJgT94Q5ZCgUFwShJiUYfh0Ybe1GGm01Kf59kmjK6PTRlhM%2BNR66rRT6WKoCsSN3bzejdGjq%2BsNCZK7T%2B4ugeieC72d23kjkU8WiDfT7EuP07M9WopCsKTxdhnD0wdw93Ko0NmMBBlGHQB1N3IDil3u2rH%2BpVVeXajADoXSHc5PPANaUIkupclY8pf0yz%2B%2FS1HtS9j9%2FEU6lasAvjTyWcxch%2Fcgu%2FwhOsinRsF4jDMYA9oytUBl5urtKQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20230228T003730Z&X-Amz-SignedHeaders=host&X-Amz-Expires=43200&X-Amz-Credential=ASIAVHMZ4BXRCZLAORPZ%2F20230228%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Signature=9851dfc1b962687dbfe07e0e1c1a5b9e2672a029195ed8d760cefe0d9bbd5805" type="video/mp4"/>
    </video>
    }
    actions={[
      <SettingOutlined key="setting" />,
      <EditOutlined key="edit" />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      title="Brgy. Hall/ L. Jaena Camera 4"
    
    />
  </Card>
    </Space>

</AppLayout>
  );
};

export default App;
