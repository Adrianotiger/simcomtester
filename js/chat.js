const TabChat = new class
{
  constructor()
  {
    this.div = _CN("div", {class:"box chat"}, [_CN("h2", {}, ["Chat"])]);
    this.chat = _CN("input", {type:"text", placeholder:"custom AT commands"}, [], this.div);
  }
  
  Init()
  {
    document.body.appendChild(this.div);
    window.addEventListener("serial", (data)=>{
      this.#Serial(data.detail);
    });
    window.addEventListener("send", (data)=>{
      this.#Send(data.detail);
    });
    window.addEventListener("cominfo", (data)=>{
      this.#Info(data.detail);
    });
    
    this.chat.addEventListener("keypress", (k)=>{
      if(k.key === "Enter")
      {
        SIMSerial.Send(this.chat.value + "\r\n", null);
      }
    });

    window.addEventListener("serialactive", (data)=>{
      if(data.detail)
      {
        this.div.style.pointerEvents = "inherit";
        this.div.style.opacity = 1;
      }
      else
      {
        this.div.style.pointerEvents = "none";
        this.div.style.opacity = 0.5;
      }
    });
  }
  
  #Serial(data)
  {
    let div = _CN("div", {class:"msg_g"}, [], this.div);
    let msg = _CN("div", {class:"msg_r"}, [], div);
    if(data.cmd)
    {
      data.cmd.ShowChat(msg);
    }
    else
    {
      var at = new ATBase({read:true, write:true, test:true, exe:true});
      at.Parse(data.answer);
      at.ShowChat(msg);
    }
    
    setTimeout(()=>{
      //_CN("br", {}, [], this.div);
      
      //const r = this.div.getBoundingClientRect();
      this.div.scrollTo({top: parseInt(this.div.scrollHeight), behavior:"smooth"});
    }, 50);
  }
  
  #Send(data)
  {
    const req = data.req + "\r\n";
    let div = _CN("div", {class:"msg_g"}, [], this.div);
    let send = _CN("div", {class:"msg_s"}, [data.req], div);
    
    if(data.cmd)
    {
      const cmd2 = data.cmd;
      if(data.cmd.CanTest() && data.req.indexOf("=?") < 0)
      {
        let help = _CN("span", {class:"msg_h"}, ["?"], div);
        let req2 = req.trim();
        if(req2.indexOf("=") > 0)
          req2 = req2.substring(0, req2.indexOf("="));
        else if(req2.indexOf("?") > 0)
          req2 = req2.substring(0, req2.indexOf("?"));
        
        help.addEventListener("click", ()=>{
          cmd2.Test();
        });
      }
      _CN("i", {}, [data.cmd.GetDescription()], div);
      let manual = _CN("b", {}, ["📃"], div);
      manual.addEventListener("click", ()=>{
        const event = new CustomEvent("manual", { detail: cmd2 });
        window.dispatchEvent(event);
      });
    }
    else
    {
      _CN("i", {}, ["-unknown command-"], div);
    }
    
    send.addEventListener("click", ()=>{
      this.chat.value = req.trim();
      SIMSerial.Send(req);
    });
  }
  
  #Info(data)
  {
    let div = _CN("div", {class:"msg_g", style:"text-align:center;"}, [], this.div);
    if(data.error)
    {
      _CN("div", {class:"msg_i", style:"background:linear-gradient(to bottom, #fee, #f88);"}, [data.error], div);
    }
    else if(data.info)
    {
      _CN("div", {class:"msg_i"}, [data.info], div);
    }
  }
};

window.addEventListener("load", ()=>{
  TabChat.Init();
});