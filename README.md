# SimCom Tester
This webpage will let you send some simple commands to your SimCom Module. 
- Send AT-Commands to you SimCom module directly over the webpage
- No downloads or installation
- Description of every command, with integrated help and AT-manual
- Check module and firmware
  
❕ Actually, only the **SIM7080G** (SIM7070G and SIM7090G) is implemented. Other modules can be implemented in future without much work.  


# Setup
- Connect your module with your PC (USB or Serial).
- Open the webpage with Edge, Chrome or another browser with Serial-functionality.
- Press on "Connect" and select the right serial port on your browser (the first SimTech serial port, on USB)
- If everything is connected, you should see something like this:

![image](https://github.com/user-attachments/assets/89ba27e9-5835-451b-8933-629ae4760c6c)

# How to use
- You can press any predefined commands on the left panel
- Or you can write the commands directly in the "chat"
- If you press on "📃" a tutorial should be visible for that command.

# Issues  
I am testing a SIM7080 Module, so this page has some 7080-specific commands.

The structure should let me/us to add (without much works) more commands and to add module-specific commands.

The page is not able to parse "unsolicited results". I need to integrate this functionality.
