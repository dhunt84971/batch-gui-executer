# Batch-GUI-Executer
This program can be called and passed the name of a batch file (or executable) with arguments.  It will then display a window, execute the program and wait for the it to complete before closing the window.

It is intended to be called by other programs that need to execute an external command or application where displaying the status of the external command would be difficult and the length of time to execute the external command is more than a few seconds.  In these situations, this application provides the feedback to the user that something is happening (e.g. like generating/printing a report).

Arguments passed to this application will allow the programmer to customize the window and its operation.

## Installation Folder
On windows computers the application is typically installed in the following folder:

```C:\Users\<username>\AppData\Local\Programs\batch-gui-executer```

This is usually hidden but can be found by typing ```%LOCALAPPDATA%``` into the address bar of windows explorer.

Since the application is intended to be run from the command line it will be necessary to open a command prompt and navigate to this folder or add the folder path to the PATH environment variable.

## Arguments
The following command line arguments can be issued.  Most are optional.

| Argument | Long Name | Description | Required / Optional | Example | Comment |
| :-- | :-- | --- | --- | :-- | :-- |
| -b | --batch-file | The full path and filename of the batch file to be executed. | Required | -b "C:\PrintReport.bat" |  |
| -s | --size | The size of the window. | Optional | -s "400x300" | If not specified the size of the window will be 300x200. |
| -h | --hidden | Do not display the window. | Optional | -h | If not specified the window will be displayed.  Since the point of the program IS to display a window, this is provided for those implementing standard calls to external functions. |
| -w | --wait-for-ok | Wait for the user to click OK. | Optional | -w | Without this option the window will close when the batch file has finished executing. |
| -l | --log-window | Display the log window. | Optional | -l | The log window displays the feedback from the batch file. |
| -t | --title | The title to be displayed for the window. | Optional | -t "Print Report" | The application name "Batch-GUI-Executer" will be used by default. |
| -m | --message | The message to display to the end-user. | Optional | -m "Running report.....  Please wait." | If this option is not specified the message will be "Executing **batch-file** name." |

## Executing from ```npm start``` Script
In order to pass arguments properly when executing this from the development enviroment, be sure to use the double-dash after ```npm start```.  For example, the syntax to execute the application using npm start would be:

```
npm start -- --batch-file "C:\PrintReport.bat" -w -l -t "Printing Report" -m "Please wait.... Printing report." -s "400x200"
```
