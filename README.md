# <img src="chrome-extension-package/icon.png" width="40"> Klink
This Chrome extension will share any active tab through Facebook Messenger with one click.

![Screenshot](screenshot-Klink.png)

### Server part
- Make sure you have [Node.js](https://nodejs.org/) installed
- From your terminal, go into **nodejs-server** folder and run `npm install`  
- Run the server by executing `npm start`  
- Wait for `Listening on :8080` message  

### Klink Extension part

- From Google Chrome, type `chrome://extensions` in a new tab  
- Check *Developer mode*  
- Click *Load unpacked extension* and select the **chrome-extension-package** folder of the project  
- You should see a new extension in the toolbar, use your Facebook credentials to log in  

Your credentials won't be store and only be used once for the first login.  
Next, *appstate.json* will contain your Facebook session for further connections.

If any errors are thrown into the terminal, just restart the server.

Enjoy!

# <img src="chrome-console-ext-package/img/F_.png" width="40"> FBConsole
This Chrome extension will chat with somebody through Facebook Messenger within developer tools

![Screenshot](screenshot-FBconsole.png)

### Server part
The same as Klink server

### FBconsole Extension part

- From Google Chrome, type `chrome://extensions` in a new tab  
- Check *Developer mode*  
- Click *Load unpacked extension* and select the **chrome-console-ext-package** folder of the project  
- You should see a new extension in the toolbar, go to option page to log in  Facebook and set up the person you want to chat
