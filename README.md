# Klink ![Klink image](chrome-extension-package/icon.png=100x)
This extension will share any active tab through Facebook Messenger with one click.

**Server part**  
• From your terminal, go into **nodejs-server** folder and run *npm install*  
• Then run the server by executing *node app.js*  
• Wait for *Listening on :8080* message  

**Extension part**  
• In Google Chrome, type *chrome://extensions* in a new tab  
• Check *Developer mode*  
• Click *Load unpacked extension* and select the **chrome-extension-package** folder of the project  
• You should see a new extension in the toolbar, use your Facebook credentials to log in  

Your credentials won't be store and only be used once for the first login.  
Next, *appstate.json* will contain your Facebook session for further connections.

If any errors are thrown into the terminal, just restart the server.

Enjoy!
