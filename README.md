# Vue-Electron manual setup

In the following steps I will explain how to setup a Vue-Project with Electron and Electron-Builder from scratch and without huge boilerplate. I know there are ready-to-use solutions like [SimulatedGREG/electron-vue](https://github.com/SimulatedGREG/electron-vue). This was just an experiment how to implement it by myself. I'm just describing the basic steps to make it work. This can be extended, optimized and configured in many ways. Maybe this helps someone :)

## Requirements

- Vue-CLI
- yarn (recommended from electron-builder. If you are not using electron-builder, you might not need yarn)

## Create project
```
vue create my-project
```

## Vue setup

Before we can package our Vue-App in electron we need to prepare our project. We need to separate the vue part, so we can build it separately and package the builded vue-app in electron.

To separate the vue part, create a new folder `renderer` inside the `src` folder and move all content of `src` to `renderer`.

Because Vue expects the files to be in the root of `src` we need to tell it, where the vue files are now located.

For that we create a new file `vue.config.js` with following content in the root of the project:
```
const path = require("path");

module.exports = {
  chainWebpack: config => {
    config
      .entry("app")
      .clear()
      .add(path.join(__dirname, "./src/renderer/main.js"))
      .end();

    config.resolve.alias
      .set("@", path.join(__dirname, "./src/renderer"))
  },
  outputDir: path.resolve(__dirname, "./dist/web"),
  publicPath: "./"
}
```

Build the vue app
```
yarn build
```

The compiled vue app should appear in `dist\web\`

## Electron setup

Install electron

```
yarn add electron --dev
```

Create a new folder `main` in `src`.

Add file `electron.js` to `src\main` with your electron config. Make sure to load the `index.html` from `dist\web`.
```
const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('dist/web/index.html')

  // Open the DevTools.
  win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
```

Add new field `main` to `package.json`. Here we define where the electron start file is.
```
"main": "./src/main/electron.js"
```

Add a new line to `scripts` in `package.json` to start the electron app
```
"start": "electron ."
```

Try to start the electron app
```
yarn start
```

Your Vue-app should be opend in electron

## Electron-Builder setup

Install electron-builder
```
yarn add electron-builder --dev
```

Add scripts to `package.json` to use electron-builder
```
"ebpack": "electron-builder --dir",
"ebdist": "electron-builder"
```

Add a `build` configuration to `package.json` to define the files you want to include in your electron app. To work properly we need the compiled Vue-App from `dist\web` and the source files from `src\main`. I also changed the output so all electron builds will be stored in a subfolder in `dist`.
```
"build": {
    "files": [
      "./dist/web/**/*", 
      "./src/main/**/*"
    ],
    "directories": {
      "output": "./dist/electron"
    }
}
```

Pack the electron app
```
yarn ebpack
```

You should find a runnable version of your app inside `dist/electron`.
