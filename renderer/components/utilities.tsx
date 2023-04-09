import { Timestamp, serverTimestamp } from 'firebase/firestore';
import { logObjects } from '../firebase';
export const drawRect = (detections, ctx) =>{
    // Loop through each prediction
    const now = new Date()
    const month = now.getMonth()+1
    const day = now.getDate()
    const year = now.getFullYear()
    const date = 
    detections.forEach(prediction => {
  
      // Extract boxes and classes
      const [x, y, width, height] = prediction['bbox']; 
      const text = prediction['class']; 
  
      // Set styling
      const color = Math.floor(Math.random()*16777215).toString(16);
      ctx.strokeStyle = '#' + color
      ctx.font = '18px Arial';
  
      // Draw rectangles and text
      if(prediction.class=="person" || prediction.class=="bicycle" || prediction.class=="car" || prediction.class=="motorcycle"){
        ctx.beginPath();   
        ctx.fillStyle = '#' + color
        ctx.fillText(text, x, y);
        ctx.rect(x, y, width, height); 
        ctx.stroke();
        console.log(prediction)
   
      }
      

      logObjects('Camera 1', {
        name: 'Camera 1',
        location: 'Brgy. Hall/ L. Jaena',
        created: serverTimestamp()
      },`${year}-${month}-${day}`,{
        bbox:prediction.bbox,
        class:prediction.class,
        score:prediction.score,
        created: serverTimestamp()
      })
    });
  }