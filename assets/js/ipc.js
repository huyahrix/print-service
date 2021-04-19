const { ipcRenderer } = require("electron"),

  expressAppUrl = "http://127.0.0.1:3000",
  // For electron-packager change cwd in spawn to app.getAppPath() and
  // uncomment the app require below

  // app = require('electron').remote.app,
  // node = app.getAppPath(
  //   ".\\node_modules\\node\\bin\\node.exe",
  //   ["./express-app/bin/www"],
  //   {
  //     cwd: process.cwd()
  //   }
  // ),

  spawn = require("child_process").spawn,
  // node = spawn(
  //   ".\\node_modules\\node\\bin\\node.exe",
  //   ["./express-app/bin/www"],
  //   {
  //     cwd: process.cwd()
  //   }
  // ),

  app = require("electron").remote.app,
  node = spawn(".\\node_modules\\node\\bin\\node.exe", ["./express-app/server.js"], {
    cwd: app.getAppPath()
  }),
  request = require("request"),
  _ = require("lodash");

ipcRenderer.on("stop-server", (event, data) => {
  // This is okay for now but there is a better solution. We can use IPC to
  // tell the server (the Express app itself) to gracefully shutdown. This
  // would be much better especially if we had database connections or other
  // resources we were using that needed to be cleaned up.
  node.kill("SIGINT");
});

ipcRenderer.on("show-server-log", (event, data) => {
  if (document.getElementById("serverLog").style.display === "none") {
    document.getElementById("serverLog").style.display = "block";
    document.getElementById("print").style.display = "none";
  } else {
    document.getElementById("print").style.display = "block";
    document.getElementById("serverLog").style.display = "none";
  }
});

function strip(s) {
  // regex from: http://stackoverflow.com/a/29497680/170217
  return s.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );
}

function redirectOutput(x) {
  let lineBuffer = "";

  x.on("data", function (data) {
    lineBuffer += data.toString();
    let lines = lineBuffer.split("\n");

    _.forEach(lines, l => {
      if (l !== "") {
        document.getElementById("serverLog").innerHTML += (strip(l) + "<br/>");
      }
    });

    lineBuffer = lines[lines.length - 1];
  });
}

redirectOutput(node.stdout);
redirectOutput(node.stderr);

let { remote } = require("electron");
// console.log(process.versions.electron);

// const { PosPrinter } = remote.require("electron-pos-printer");
// // const {PosPrinter} = require("electron-pos-printer"); //dont work in production (??)

// const path = require("path");

let webContents = remote.getCurrentWebContents();
let printers = webContents.getPrinters(); //list the printers

printers.map((item, index) => {
  //write in the screen the printers for choose
  document.getElementById("list_printers").innerHTML +=
    ' <input type="radio" id="printer_' +
    index +
    '" name="printer" value="' +
    item.name +
    '"><label for="printer_' +
    index +
    '">' +
    item.name +
    "</label><br>";
});

let checkServerRunning = setInterval(() => {
  request(expressAppUrl, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      // document.getElementById("expressApp").src = expressAppUrl;

      // document.getElementById("print").style.display = "none";
      // document.getElementById("serverLog").style.display = "block";

      // document.getElementById("print").style.display = "block";
      // document.getElementById("serverLog").style.display = "none";
      clearInterval(checkServerRunning);
    }
  });
}, 1000);

window.onkeydown = evt => {
  switch (evt.keyCode) {
    //ESC
    case 27:
      break;
    //F12
    case 123:
      const currentWebContents = require("electron").remote.getCurrentWebContents();
      currentWebContents.toggleDevTools();
      break;
    default:
      return true;
  }
  return false;
};