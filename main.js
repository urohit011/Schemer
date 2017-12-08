const{app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');

let win;
let colorInfoWindow;
let colorData;

function createWindow(){
    win = new BrowserWindow({
        width: 800, 
        height: 600, 
        titleBarStyle: 'hidden-inset'
    });

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true 
    }));

    win.on('closed', () => {
        win = null;
    })
}

app.on('ready', createWindow);

ipcMain.on('color-info', (event, arg) => {

    if (colorInfoWindow) {
        return;
    }

    colorData = arg;
    colorInfoWindow = new BrowserWindow({
        frame: false,
        width: 800,
        height: 500,
        resizable: false
    });

    colorInfoWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'info.html'),
        protocol: 'file',
        slashes: true 
    }));

    colorInfoWindow.on('closed', () => {
        colorInfoWindow = null;
    });
});

ipcMain.on('color-window-loaded', (event, arg) => {
    event.sender.send('color-data', colorData);
})

ipcMain.on('close-color-window', (event, arg) => {
    if (colorInfoWindow) {
        colorInfoWindow.close();
    }
})

app.on('window-all-closed', () => {
    app.quit();
});
