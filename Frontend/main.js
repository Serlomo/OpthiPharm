const { app, BrowserWindow, Menu } = require("electron");

if (process.env.NODE_ENV !== "production") {
  require("electron-reload")(__dirname, {});
}

let ventanaPrincipal;

let menuAplicacionPlantilla = [
  {
    // label: "",
    // submenu: [
    //     {
    //         label: 'Busqueda',
    //         click: () => {
    //             abrirVentanaAcercaDe();
    //         }
    //     }
    // ]
  },
];

function crearVentanaPrincipal() {
  ventanaPrincipal = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  ventanaPrincipal.loadFile("index.html");

  let menu = Menu.buildFromTemplate(menuAplicacionPlantilla);
  ventanaPrincipal.setMenu(menu);

  ventanaPrincipal.on("closed", () => {
    ventanaPrincipal = null;
  });
}

// function abrirVentanaAcercaDe() {
//     let ventanaAcercaDe = new BrowserWindow({
//         parent: ventanaPrincipal,
//         modal: true,
//         show: false,
//         width: 1000,
//         height: 1000,
//     });

//     ventanaAcercaDe.loadFile('acerca-de.html');
//     ventanaAcercaDe.setMenu(null);
//     ventanaAcercaDe.once('ready-to-show', () => {
//         ventanaAcercaDe.show();
//     });
// }
app.allowRendererProcessReuse = true;
app.whenReady().then(crearVentanaPrincipal);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (ventanaPrincipal === null) {
    crearVentanaPrincipal();
  }
});
