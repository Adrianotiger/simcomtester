# SimCom Tester
This webpage will let you send some simple commands to your SimCom Module. 
- Send AT-Commands to you SimCom module directly over the webpage
- No downloads or installation
- Description of every command, with integrated help and AT-manual
- Check module and firmware
  
❕ Actually, only the **SIM7080G** (SIM7070G and SIM7090G) is implemented. Other modules can be used if compatible or can be implemented in future without much work.  


# Setup
- Connect your module with your PC (USB or Serial).
- Open the webpage with Edge, Chrome or another browser with Serial-functionality.
- Press on "Connect" and select the right serial port on your browser (the first SimTech serial port, on USB)
- If everything is connected, you should see something like this:

![image](https://github.com/user-attachments/assets/194d2c5b-7a57-4671-8e90-c0ede48043d3)


# How to use
- You can press any predefined commands on the left panel
- Or you can write the commands directly in the "chat"
- If you press on "📃" a tutorial should be visible for that command.

# How to edit/test
- Create a workspace in GitHub
- Add extension "Live Preview" from Microsoft
- Open index.html and press on the right/top button "show preview", opening the browser-tab in a new window
- Edit and test it until you have a working version.

# Issues  
I am testing a SIM7080 Module, so this page has some 7080-specific commands.

The structure should let me/us to add (without much works) more commands and to add module-specific commands.

The page is not able to parse "unsolicited results". I need to integrate this functionality.

# Credits
[Web Serial Port API (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/API/SerialPort)  
[Javascript PDFLib for (github.com)](https://github.com/mozilla/pdf.js)  
[SimCom Module (simcom.com)](https://www.simcom.com/product/SIM7080G.html)  

Too complicated or module does not answer? Try a Web Serial Terminal: https://www.serialterminal.com/
