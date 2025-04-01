const SIMSerial = new class
{
  #port = null;
  #connected = false;
  #busy = false;
  #data = {cmd:null, req:"", answer:""};
  #disconnect = true;
  
  constructor()
  {
    let div = _CN("div", {class:"box serialdiv"}, []);
    _CN("h2", {}, ["Serial"], div);
    
    this.div = _CN("div", {}, [], div);
  }
  
  Init()
  {
    document.body.appendChild(this.div.parentNode);
    
    let b = _CN("button", {style:"display:block;"}, ["CONNECT"]);
    b.addEventListener("click", ()=>{
      navigator.serial.requestPort().then((port)=>{
        this.#Connect(port);
      });
    });
    
    navigator.serial.getPorts().then((ports) => {
      if(ports.length === 0)
      {
        this.div.textContent = "Select COM port";
        this.div.appendChild(b);

        const win = document.getElementsByClassName("loading")[0];

        _CN("p", {}, ["Select the SimCom port"], win);
        let i1 = _CN("select");
        [9600,14400,19200,38400,47600,115200,128000,256000].forEach(o=>{
          let o1 = _CN("option", {value:o}, [o], i1);
          if(o==115200) o1.setAttribute("selected", true);
        });
        let b2 = _CN("button", {style:"display:block;"}, ["Search Module"]);
        b2.addEventListener("click", ()=>{
          navigator.serial.requestPort().then((port)=>{
            this.#Connect(port, i1.value);
          });
        });
        win.appendChild(i1);
        win.appendChild(b2);
      }
      else
      {
        this.div.textContent = "Connecting...";
        // some browsers are too fast and can't restore serial, after refreshing a page. Leave some extra time
        setTimeout(()=>{
          this.#Connect(ports[0]);
        }, 200);
      }
    }).catch(()=>{
      let b = _CN("h3", {}, ["Error: no serial detected"], document.getElementsByClassName("loading")[0]);
    });
  }
  
  IsConnected()
  {
    return this.#connected;
  }
  
  SendChar(intVal)
  {
    const port = this.#port;
    const wchar = new Uint8Array(1);
    const writer = port.writable.getWriter();
    
    wchar[0] = intVal;
    console.log("Serial send ", "0x" + intVal.toString(16));

    writer.write(wchar).then(()=>{
      writer.releaseLock();
    });
  }
    
  SendData(str)
  {
    const port = this.#port;
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    
    console.log("Serial send ", str.length + " bytes");

    writer.write(encoder.encode(str)).then(()=>{
      writer.releaseLock();
    });
  }
  
  Send(cmd, obj = null)
  {
    if(this.#connected && !this.#busy)
    {
      if(obj == null)
      {
        let pos1 = cmd.indexOf("=");
        let pos2 = cmd.indexOf("?");
        let pose = -1;
        if(pos1 > 0 || pos2 > 0) pose = pos1 < 0 ? pos2 : pos1;
        let cmdat = cmd.substr(0, pose > 0 ? pose : undefined).trim().toUpperCase();
        console.log("SEARCH FOR " + cmdat);
        if(ATs[cmdat])
        {
          obj = ATs[cmdat];
          console.log("command found, regenerate request.", cmd.substr(cmdat.length, 2));
          switch(cmd.substr(cmdat.length, 1))
          {
            case '=': 
              if(cmd.substr(cmdat.length + 1, 1) == '?') return ATs[cmdat].Test();
              else return ATs[cmdat].Write(ATs[cmdat].Comma2List(cmd.substr(cmdat.length + 1)));
            case '?': return ATs[cmdat].Read();
            default: return ATs[cmdat].Execute();
          }
          
        }
      }
      this.#busy = true;
      const port = this.#port;
      const encoder = new TextEncoder();
      const writer = port.writable.getWriter();
      this.#data.req = cmd.trim();
      this.#data.cmd = obj;
      console.log("Serial send", cmd);
      
      const event = new CustomEvent("send", { detail: this.#data });
      window.dispatchEvent(event);
              
      writer.write(encoder.encode(cmd)).then(()=>{
        writer.releaseLock();
      });
    }
    else
    {
      console.error("Serial not ready!");
    }

    let p = new Promise((succ, rej)=>{
      setTimeout(()=>{
        if(this.#connected && !this.#busy) succ();
        else rej();
      }, 10);
    });
    return p;
  }
  
  Connect()
  {
    navigator.serial.getPorts().then((ports) => {
      if(ports.length > 0)
      {
        this.#Connect(ports[0]);
      }
      else
      {
        console.warn("no serial ports available...");
        setTimeout(()=>{this.Connect();}, 1000);
      }
    });
  }
  
  #Connect(port, baud=115200)
  {
    this.#disconnect = false;
    return new Promise((res,rej) => {
      port.setSignals({ dataTerminalReady: false, requestToSend: false }).then(()=>{}).catch(()=>{});
      port.open({ baudRate: baud }).then(()=>{
        this.#port = port;
        this.#connected = true;
        this.div.textContent = "COM Connected";
        setTimeout(()=>{
          this.#BeginRead();
          res();
        }, 100);
        console.log(port.getInfo());
        const event = new CustomEvent("serialactive", { detail: true });
        window.dispatchEvent(event);

        let b = _CN("button", {style:"background:linear-gradient(to bottom, #fff, #faa);"}, ["DISCONNECT"], this.div);
        b.addEventListener("click", ()=>{
          this.#disconnect = true;
          b.enabled = false;
          b.style.opacity = 0.5;
          setTimeout(()=>{
            this.#Disconnect(port);
          }, 100);
        });
      }).catch(e=>{rej();});
    });
  }

  Disconnect()
  {
    if(this.#port)
    {
      this.#disconnect = true;
      this.#Disconnect(this.#port);
    }
  }

  #Disconnect(port)
  {
    let successfullyDisconnected = false;

    if(this.#connected)
    {
      port.close().then(()=>{
        this.#connected = false;
        this.div.textContent = "Disconnected";
        successfullyDisconnected = true;
      }).catch(e=>{});
    }

    if(!this.#connected) successfullyDisconnected = true;

    if(successfullyDisconnected) 
    {
      this.#busy = false;

      const event = new CustomEvent("serialactive", { detail: false });
      window.dispatchEvent(event);
      
      const b2 = _CN("button", {style:"background:linear-gradient(to bottom, #fff, #afa);"}, ["RE-CONNECT"], this.div);

      b2.addEventListener("click", ()=>{
        navigator.serial.requestPort().then((port)=>{
          this.#Connect(port);
        });
      });
    }
    else
    {
      setTimeout(()=>{this.#Disconnect(port)}, 500);
    }
  }

  async #readOrDisconnect(reader) {
    const timer = setInterval(() => {
      if(this.#disconnect) reader.releaseLock();
    }, 200);

    try {
        const ret = await reader.read()
        clearInterval(timer);
        return ret;
    } finally {
        clearInterval(timer);
    }
  }
  
  async #BeginRead()
  {    
    const port = this.#port;
    let serialMsg = "";
    let isClosing = false;
    let newCmd = null;
    const decoder = new TextDecoder();
    console.warn("Begin read serial...");
    
    while (port.readable && !isClosing) 
    {
      const reader = port.readable.getReader();
      if(this.#disconnect)
        break;
      
      try 
      {
        const regex1 = RegExp(/\+([A-Z]+)\:/, 'g');
        let dataToRead = 0;

        while (true) 
        {
          const { value, done } = await this.#readOrDisconnect(reader);
          if(this.#disconnect) break;
          if (done) 
          {
            // |reader| has been canceled.
            break;
          }
          serialMsg += decoder.decode(value);
          const oldMsg = serialMsg;
          
          setTimeout(()=>{
            if(oldMsg == serialMsg)
            {
              let serialPos = -1;
              let serialLine = "";
              /* NEW: Unsolicited result code */
              while((serialPos = serialMsg.indexOf("\r")) >= 0)
              {
                serialLine = serialMsg.substring(0, serialPos).trim();
                serialMsg = serialMsg.slice(serialPos + 1);
                if(serialLine.length == 0) continue;
                console.log(">>>>PARSE LINE>>>> " + serialLine);
                let cmdArr = regex1.exec(serialLine);
                  // is it a command answer line? (+ATXXXX:) ?
                if(cmdArr != null && cmdArr.index===0 && typeof cmdArr[1] != 'undefined')
                {
                  console.log("CMD Serial line: ", serialLine/*, cmdArr*/);
                  //const ATx = ATs["AT+" + cmdArr[1]];
                  const ATx = serialLine.indexOf(":") > 0 ? ATs[serialLine.substring(0, serialLine.indexOf(":")).trim()] : ATs["AT+" + cmdArr[1]];
                    // It is AT is valid and was found in the list
                  if(typeof ATx !== 'undefined')
                  {
                    if(this.#data.cmd == null) // this is a unsolicited result
                    {
                      console.warn("Unsolicited Result!");

                      this.#data.req = "";
                      this.#data.answer = serialLine;
                      this.#data.cmd = ATx;
                      this.#data.cmd.Unsolicited();
                      this.#data.cmd.Parse(serialLine);
                    }
                    else
                    {
                      dataToRead = ATx.Parse(serialLine);
                    }
                    if(dataToRead > 0)
                    {
                      console.error("Not yet implemented, AT has more data to read as payload....");
                    }
                  }
                    // AT is not valid but an AT-command sent this request
                  else if(this.#data.cmd)
                  {
                    window.dispatchEvent(
                      new CustomEvent("cominfo", { detail: {error:"Command " + "AT+" + cmdArr[1] + " is not registered (1)"}})
                    );
                    console.warn("Undefined command, should not happens.", cmdArr[1], serialLine);
                    this.#data.cmd.Parse();
                  }
                    // AT is not valid
                  else
                  {
                    window.dispatchEvent(
                      new CustomEvent("cominfo", { detail: {error:"Command " + "AT+" + cmdArr[1] + " is not registered (2)"}})
                    );
                    console.error("Undefined command, should not happens.", cmdArr[1], serialLine);
                  }
                }
                else
                {
                  // Unsolicited result?
                  console.log("TXT Serial line: ", serialLine/*, cmdArr*/);
                  if(this.#data.cmd)
                  {
                    this.#data.cmd.Parse(serialLine);
                      // Command answer is terminated
                    if(serialLine.trim() == "OK" || serialLine.trim().startsWith("ERROR"))
                    {
                      this.#data.answer = this.#data.cmd.GetLines().join("\r\n");

                      const clonedData = {...this.#data};
                      const event = new CustomEvent("serial", { detail: clonedData });
                      window.dispatchEvent(event);

                      console.log("ANSWER WITH CLONED DATA", clonedData);

                      console.log("resetting AT request");

                      this.#data.cmd = null;
                      this.#data.req = "";
                      this.#data.answer = "";
                    }
                  }
                  else if(serialLine.indexOf(":") > 0 && typeof(ATs[serialLine.substring(0, serialLine.indexOf(":")).trim()]) !== 'undefined')
                  {
                    console.warn("Unsolicited Result!");

                    this.#data.req = "";
                    this.#data.answer = serialLine;
                    this.#data.cmd = ATs[serialLine.substring(0, serialLine.indexOf(":")).trim()];
                    this.#data.cmd.Unsolicited();
                    this.#data.cmd.Parse(serialLine);
                  }
                  else
                  {
                    console.warn("No command requested this line: ", serialLine);
                    window.dispatchEvent(
                      new CustomEvent("cominfo", { detail: {error:"No command requested this line: " + serialLine}})
                    );
                  }
                }
              }

              if(this.#data.cmd != null)
              {
                console.log("Didn't got an OK or ERROR");

                const clonedData = {...this.#data};
                const event = new CustomEvent("serial", { detail: clonedData });
                window.dispatchEvent(event);
              }

              this.#busy = false;
              this.#data.answer = oldMsg;

              serialMsg = "";
              if(this.#data.cmd)
              {
                // reset command, for unsolicited result
                this.#data.cmd = null;
                this.#data.req = null;
              }

              //serialMsg = oldMsg;

              // todo: rewrite this if for unsolicited result!
              // 1. every line must be parsed separately
              // 2. if a line contains payload data, the "Parse()"-function should return the quantity of data expected.
              // 3. if OK is parsed, this.#data.cmd can be confirmed with OK as the command probably executed the command.
              /*
              if(this.#data.cmd)
              {
                if(this.#data.cmd.HoldUp(serialMsg))
                {
                  // Wait for expected string
                  return;
                }
              }
              else
              {
                console.warn("Is this an Unsolicited Result?");
                console.warn(serialMsg);
              }
              this.#busy = false;
              this.#data.answer = oldMsg;
              if(this.#data.cmd)
              {
                //this.#data.cmd.Parse(serialMsg);
              }
              */
            }
          }, 300);
          console.log("Serial received", serialMsg);
          // Do something with |value|…
        }
      } catch (error) {
        // Handle |error|…
        if(!this.#disconnect)
          console.error("Serial closed", error);
        isClosing = true;
      } finally {
        reader.releaseLock();
        console.warn("Serial closed");
        if(!this.#disconnect) setTimeout(()=>{this.#Disconnect(port);}, 50);
      }
    }
  }
};

window.addEventListener("load", ()=>{
  SIMSerial.Init();
});
