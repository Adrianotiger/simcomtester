const SIMSerial = new class
{
  #port = null;
  #connected = false;
  #busy = false;
  #data = {cmd:null, req:"", answer:""};
  
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

        _CN("p", {}, ["Select the SimCom port"], document.getElementsByClassName("loading")[0]);
        let b2 = _CN("button", {style:"display:block;"}, ["Search Module"]);
        b2.addEventListener("click", ()=>{
          navigator.serial.requestPort().then((port)=>{
            this.#Connect(port);
          });
        });
        document.getElementsByClassName("loading")[0].appendChild(b2);
      }
      else
      {
        this.div.textContent = "Connecting...";
        this.#Connect(ports[0]);
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
    console.log("Serial data", "0x" + intVal.toString(16));

    writer.write(wchar).then(()=>{
      writer.releaseLock();
    });
  }
    
  SendData(str)
  {
    const port = this.#port;
    const encoder = new TextEncoder();
    const writer = port.writable.getWriter();
    
    console.log("Serial data", str.length + " bytes");

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
          //cmdat = cmdat.replace("+", "_");
          console.log("command found!");
          obj = ATs[cmdat];
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
  
  #Connect(port)
  {
    return new Promise((res,rej) => {
      port.open({ baudRate: 115200 }).then(()=>{
        this.#port = port;
        this.#connected = true;
        this.div.textContent = "COM Connected";
        setTimeout(()=>{
          this.#BeginRead();
          res();
        }, 100);
        console.log(port.getInfo());
        let b = _CN("button", {style:"background:linear-gradient(to bottom, #fff, #faa);"}, ["DISCONNECT"], this.div);
        b.addEventListener("click", ()=>{
          port.close().then(()=>{
            this.div.textContent = "Disconnected";
            this.#connected = false;
            let b2 = _CN("button", {style:"background:linear-gradient(to bottom, #fff, #afa);"}, ["RE-CONNECT"], this.div);
            b2.addEventListener("click", ()=>{
              navigator.serial.requestPort().then((port)=>{
                this.#Connect(port);
              });
            });
          });
        });
      }).catch(e=>{rej();});
    });
  }
  
  async #BeginRead()
  {    
    const port = this.#port;
    let serialMsg = "";
    let isClosing = false;
    const decoder = new TextDecoder();
    console.warn("Begin read serial...");
    
    while (port.readable) 
    {
      const reader = port.readable.getReader();
      try 
      {
        while (true) 
        {
          const { value, done } = await reader.read();
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
              if(this.#data.cmd)
              {
                if(this.#data.cmd.HoldUp(serialMsg))
                {
                  // Wait for expected string
                  return;
                }
              }
              this.#busy = false;
              this.#data.answer = serialMsg;
              if(this.#data.cmd)
                this.#data.cmd.Parse(serialMsg);
              const event = new CustomEvent("serial", { detail: this.#data });
              serialMsg = "";
              window.dispatchEvent(event);
            }
          }, 300);
          console.log("Serial received", serialMsg);
          // Do something with |value|…
        }
      } catch (error) {
        // Handle |error|…
        console.error("Serial closed", error);
        isClosing = true;
        port.close();
      } finally {
        reader.releaseLock();
        console.warn("Serial closed");
        if(!isClosing) port.close();
        this.#connected = false;
      }
    }
  }
};

window.addEventListener("load", ()=>{
  SIMSerial.Init();
});