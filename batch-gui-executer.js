// ****************************************************************************
//
// BATCH-GUI-EXECUTER
//
// This program can be called and passed the name of a batch file (or executable)
// with arguments.  It will then display a window, execute the program and
// wait for the program to complete before closing the window.
//
// It is intended to be called by other programs that need to execute an
// external command or application where displaying the status of the external
// command would be difficult and the length of time to execute the external
// command is more than a few seconds.
//
// Options passed to this application will allow the user to customize the window
// and its operation.
//
// Options:
//
//      Wait for Ok button when process is done.
//      Display console feedback in window.
//      Do not display window.
//
//
// ****************************************************************************

"use strict";
const electron = require("electron");
const {remote} = require("electron");
const {dialog} = require("electron").remote;
const ipc = require("electron").ipcRenderer;
const fs = require("fs");
const path = require("path");
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { parsed, boolean } = require("yargs");
const spawn = require("child_process").spawn;


//#region HELPER FUNCTIONS
function logMessage(message){
    // Split the messages on the line feed.
    let messages = message.split("\n");
    for (var msg of messages){
        if (msg.includes("WARNING")){
            msg = "<span class='logWarning'>" + msg + "</span>"
            logBox.innerHTML = logBox.innerHTML + msg;
        }
        else if(msg.includes("ERROR")){
            msg = "<span class='logError'>" + msg + "</span>"
            logBox.innerHTML = logBox.innerHTML + msg;
        }
        else {
            msg = "<span>" + msg + "</span>"
            logBox.innerHTML = logBox.innerHTML + msg;
        }
        logBox.scrollTop = logBox.scrollHeight;    
    }
}

function runCLI(batchFile){
    let command = batchFile.split(" ")[0];
    let args = batchFile.split(" ").slice(1);
    logMessage("Executing: " + command + " " + args);
    const process = spawn(command, args);

    process.stdout.on("data", (data) => {
        var message = new TextDecoder("utf-8").decode(data);
        logMessage(message);
    });

    return new Promise(function(resolve,reject){
        process.on("exit", ()=>{
            resolve();
        });
    });
    
}
//#endregion HELPER FUNCTIONS


//#region INITIALIZATION
async function postProcessArgs(args){
    //Post processing of arguments.
    // If there were no arguments at all assume this is the post installation
    // start of the application and provide a help box for how to use.
    if (hideBin(remote.process.argv).length == 0){
        args.ok = false;
        args.Message = `
            Solar_print_trend is a command line application.
            It is typically installed in the %AppData%\\Local\\Programs\\batch-gui-executer folder.
            
            ${args.help}
            See documentation for how to use.
        `;
        return args;
    }
    // Set the defaults for any missing arguments
    args.ok = true;
    args.Message = "All arguments okay."
    // Check for missing batch file.
    if (!args["batch-file"]){
        args.ok = false;
        args.Message = "No batch file specified.";
        return args;
    }
    else{
        args["batch-file"] = args["batch-file"].replace(/\\/g, "/");
    }
    
    if (!args["hidden"]) args["hidden"] = false;
    if (!args["wait-for-ok"]) args["wait-for-ok"] = false;
    if (!args["log-window"]) args["log-window"] = false;
    if (!args["message"]) args["message"] = "Executing " + args["batch-file"];
    if (!args["size"]) args["size"] = "300x200";
    return args;
}

async function parseArgs(){
    // Get command line arguments.
    let parsedArgs = await yargs(hideBin(remote.process.argv))
        .option("hidden", {
            alias: "h",
            description: "Hide the window.",
            type: "boolean",
        })
        .option("wait-for-ok", {
            alias: "w",
            description: "Wait for okay button to close.",
            type: "boolean",
        })
        .option("log-window", {
            alias: "l",
            description: "Display batch file feedback in log.",
            type: "boolean",
        })
        .option("batch-file", {
            alias: "b",
            description: "Batch file to execute.",
            type: "string",
        })
        .option("title", {
            alias: "t",
            description: "Title of window.",
            type: "string",
        })
        .option("message", {
            alias: "m",
            description: "Message displayed to user.",
            type: "string",
        })
        .option("size", {
            alias: "s",
            description: "Size of window in pixels (WxH).",
            type: "string",
        });
    let args = parsedArgs.argv;
    args.help = await parsedArgs.getHelp();
    console.log(args);
    args = await postProcessArgs(args); 
    return args;
}

async function init() {
    let args = await parseArgs();
    console.log(args);
    // Display the window.
    if (args["hidden"] == false){
        electron.ipcRenderer.send("showWindow", {size: args["size"], title: args["title"]});
    }
    // Update the DOM components based on the passed arguments.
    message.innerHTML = args["message"];
    if (args["log-window"])
        logWindow.classList.remove("hide");
    // Run the command.
    await runCLI(args["batch-file"]);
    // Show the okay button or close.
    if (args["wait-for-ok"]){
        btnOk.classList.remove("hide");
    }
    else {
        var window = remote.getCurrentWindow();
        window.close();
    }
}

init();
//#endregion INITIALIZATION

//#region EVENT HANDLERS
document.getElementById("btnOk").addEventListener("click", () =>{
    var window = remote.getCurrentWindow();
    window.close();
});
//#endregion EVENT HANDLERS