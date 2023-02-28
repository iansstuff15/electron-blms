import {  notification, } from 'antd';
type NotificationType = 'success' | 'info' | 'warning' | 'error';


export const openNotificationWithIcon = (type: NotificationType, message:string, description:string) => {
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