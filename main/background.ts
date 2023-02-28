import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import { IpcMain } from 'electron';
const isProd: boolean = process.env.NODE_ENV === 'production';
const ipc = ipcMain

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 500,
    height: 250,
    autoHideMenuBar:true,
    center:true,
    titleBarStyle:'hidden',
    resizable:false,
    webPreferences:{
      nodeIntegration:true,
      contextIsolation: false,
      
    }
  });
  
  if (isProd) {
    await mainWindow.loadURL('app://./splash.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/splash`);
    mainWindow.webContents.openDevTools();
  }

  ipc.on('mainContent',()=>{
    mainWindow.setResizable(true)
    mainWindow.center()
    mainWindow.maximize()
    
  })
  ipc.on('accountContent',()=>{
   
    
    mainWindow.restore()
    mainWindow.setSize(1000,600,true)
    mainWindow.center()
    
    mainWindow.setResizable(false)
  })
  ipc.on('splash',()=>{
    mainWindow.setResizable(true)
   
    mainWindow.setSize(550,250,true)
    mainWindow.center()
    mainWindow.setResizable(false)

  })
  ipc.on('closeApp',()=>{
  
    mainWindow.close()
  })

  ipc.on('minimize',()=>{
 
    mainWindow.minimize()
  })
  ipc.on('maximize',()=>{
    if(mainWindow.isMaximized()){
      mainWindow.restore()
    }
    else{
      mainWindow.maximize()
    }
   
  })

  mainWindow.on('maximize',()=>{
    mainWindow.webContents.send('isMaximized')
    
  })
  mainWindow.on('restore',()=>{
    mainWindow.webContents.send('isRespored')
  })
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('asynchronous-message', function (evt, message) {

    async () => {
      if (message == 'createRegisterWindow') {
        const registerWindow = createWindow('register', {
          width: 1000,
          height: 700,
          autoHideMenuBar:true,
          titleBarStyle:'hidden',
          resizable:true,
        });
      if (isProd) {
        await registerWindow.loadURL('app://./register.html');
      } else {
        const port = process.argv[2];
        await registerWindow.loadURL(`http://localhost:${port}/register`);
        registerWindow.webContents.openDevTools();
      }
    }
    
  }
})