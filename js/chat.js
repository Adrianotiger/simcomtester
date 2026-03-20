const TabChat = new class
{
  constructor()
  {
    let buttShell = _CN("button", {title:"SHELL", style:"position:sticky;left:23vw;top:0px;z-index:500;transform:translate(-20px, -8px);"}, ["💻"], this.div);
    let buttChat = _CN("button", {title:"CMD", style:"position:sticky;left:23vw;top:0px;z-index:500;transform:translate(-20px, -8px);"}, ["💬"], this.div);
    let buttClearShell = _CN("button", {title:"Clear", style:"position:sticky;left:23vw;top:0px;z-index:500;transform:translate(20px, -8px);"}, ["🧹"], this.div);
    let buttClearChat = _CN("button", {title:"Clear", style:"position:sticky;left:23vw;top:0px;z-index:500;transform:translate(20px, -8px);"}, ["🧹"], this.div);

    this.div = _CN("div", {class:"box chat"}, [buttShell, buttClearChat, _CN("h2", {}, ["Chat"])]);
    this.shell = _CN("div", {title:"CHAT", class:"box chat", style:"display:none;opacity:0.0;"}, [buttChat, buttClearShell, _CN("h2", {}, ["Commands"])]);
    this.chat = _CN("input", {type:"text", class:"chatinput", placeholder:"custom AT commands"}, []);
    
    buttShell.addEventListener("click", ()=>{
      this.div.style.opacity = 0.0;
      this.div.style.filter = "blur(2px)";
      this.div.style.display = "block";
      this.shell.style.display = "block";
      this.shell.style.filter = "blur(0px)";
      setTimeout(()=>{this.shell.style.opacity = 1.0;}, 200);
      setTimeout(()=>{this.div.style.display = "none";}, 800);
    });
    buttChat.addEventListener("click", ()=>{
      this.shell.style.opacity = 0.0;
      this.shell.style.filter = "blur(2px)";
      this.div.style.display = "block";
      this.shell.style.display = "block";
      this.div.style.filter = "blur(0px)";
      setTimeout(()=>{this.div.style.opacity = 1.0;}, 200);
      setTimeout(()=>{this.shell.style.display = "none";}, 600);
    });

    const shellBaseElements = this.div.childNodes.length;
    buttClearShell.addEventListener("click", ()=>{
      while(this.shell.childNodes.length > shellBaseElements) this.shell.removeChild(this.shell.childNodes[shellBaseElements]);
    });

    buttClearChat.addEventListener("click", ()=>{
      while(this.div.childNodes.length > shellBaseElements) this.div.removeChild(this.div.childNodes[shellBaseElements]);
    });

  }
  
  Init()
  {
    document.body.appendChild(this.div);
    document.body.appendChild(this.shell);
    document.body.appendChild(this.chat);

    window.addEventListener("serial", (data)=>{
      this.#Serial(data.detail);
    });
    window.addEventListener("send", (data)=>{
      this.#Send(data.detail);
    });
    window.addEventListener("cominfo", (data)=>{
      this.#Info(data.detail);
    });
    window.addEventListener("terminal", (data)=>{
      this.#Terminal(data.detail);
    });

    let chatKeyPress = ((value,e)=>{
      if(e.key === "Enter")
      {
        SIMSerial.Send(value + "\r\n", null).then(()=>{
          // Successfully sent.
        }).catch(err=>{
          console.warn("ERROR SENDING OVER CHAT:", err);
        });
      }
    });
    
    this.chat.addEventListener("keypress", (k)=>{
      chatKeyPress(this.chat.value, k);
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

  DrawGauge(minVal, maxVal, curVal)
  {
    let gauge = _CN("div", {class:"msg_gauge"});
    if(minVal==0 && maxVal==100)
    {
      let val = curVal * 50;
      _CN("div", {}, [_CN("b", {style:`transform:translate(${val}%, -20%);`})], gauge);
      _CN("span", {style:"left:5px;"}, [minVal + "%"], gauge);
      _CN("span", {style:"right:5px;"}, [maxVal + "%"], gauge);
    }
    return gauge;
  }
  
  #Serial(data)
  {
    let div = _CN("div", {class:"msg_g"}, [], this.div);
    let msg = _CN("div", {class:"msg_r"}, [], div);

    data.answer.split("\n").forEach(lne=>{
      _CN("div", {}, ["\xa0\xa0\xa0\xa0" + lne], this.shell);
    });
    this.shell.scrollTo({top: parseInt(this.shell.scrollHeight), behavior:"smooth"});

    if(data.cmd)
    {
      if(data.answer.trim().startsWith("+") || data.cmd.GetRequestType() == "unsolicited")
      {
        const cmd = data.cmd;
        const cmdd = data.answer.trim().split("\r")[0].trim();
        let info = _CN("span", {class:"msg_a"}, ["i"], div);
        let bubble = null;
        if(cmd.GetRequestType() == 'unsolicited') msg.classList.add("msg_u");
        info.addEventListener("mouseenter",(e)=>{
          if(bubble == null)
          {
            let params = [];
            switch(cmd.GetRequestType())
            {
              case 'exe': params = cmd.GetAllParams().exe; break;
              case 'test': params = cmd.GetAllParams().test; break;
              case 'read': params = cmd.GetAllParams().read; break;
              case 'write': params = cmd.GetAllParams().write.get; break;
              case 'unsolicited': params = cmd.GetAllParams().unsolicited; break;
              default: params = cmd.GetAllParams().all;; break;
            }

            let layerX = e.layerX;
            if(layerX < 400) layerX = 400;
            bubble = _CN("div", {class:"msg_bubble", style:`left:${layerX}px;`}, [], div);
            _CN("b", {}, [cmd.GetDescription()], bubble);
            let table = _CN("table", {border:1}, [], bubble);
            const lst = cmd.Comma2List(cmdd.substring(cmdd.indexOf(":") + 1));
            let lstindex = 0;
            let defi = 0;
            for(let j=0;j<params.length;j++) if(Object.keys(params[j]).length == lst.length) defi = j;
            if(Array.isArray(params) && typeof params[0] !== 'undefined')
            {
              Object.keys(params[defi]).forEach(pk=>{
                console.log(cmd.GetParam(pk));
                const px = cmd.GetParam(pk);
                let val = lst[lstindex++];
                if(Array.isArray(px.GetType()))
                {
                  let vals = val;
                  val = _CN("select", {style:"font-size:x-small"});
                  px.GetType().forEach(t=>{
                    let o = _CN("option", {}, [t.GetValue() + " - " + t.GetDescription()], val);
                    if(vals.replace(/\"/g, '')==t.GetValue()) o.selected = true;
                  });
                }
                _CN("tr",{}, [
                  _CN("td",{}, [px.GetName()]),
                  _CN("td",{}, [val]),
                  _CN("td",{}, [px.GetDescription()])
                ], table);
              });
            }

            bubble.addEventListener("mouseleave",()=>{
              div.removeChild(bubble);
              bubble = null;
            });
          }
        });
      }

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
    let send = _CN("div", {class:"msg_s"}, [data.req??data.serialOut], div);
    
    _CN("div", {}, [" > " + data.req??data.serialOut], this.shell);
    this.shell.scrollTo({top: parseInt(this.shell.scrollHeight), behavior:"smooth"});

    if(data.cmd)
    {
      const cmd2 = data.cmd;
      if(data.cmd.CanTest())
      {
        let help = _CN("span", {class:"msg_h", title:"help"}, ["?"], div);
        
        help.addEventListener("click", ()=>{
          cmd2.Test();
        });
      }
      if(data.cmd.CanRead())
      {
        let read = _CN("span", {class:"msg_h", title:"read"}, ["📖"], div);
        read.addEventListener("click", ()=>{
          cmd2.Read();
        });
      }
      if(data.cmd.CanExecute())
      {
        let read = _CN("span", {class:"msg_h", title:"execute"}, ["⚡"], div);
        read.addEventListener("click", ()=>{
          cmd2.Execute();
        });
      }
      if(data.cmd.CanWrite())
      {
        let read = _CN("span", {class:"msg_h", title:"write"}, ["✍"], div);
        read.addEventListener("click", ()=>{
          ATEditor.ShowWrite(cmd2).then((p)=>{
            cmd2.Write(p);
          }).catch(()=>{});
        });
      }
      _CN("i", {}, [data.cmd.GetDescription()], div);
      let manual = _CN("b", {}, ["📃"], div);
      manual.addEventListener("click", ()=>{
        const event = new CustomEvent("manual", { detail: cmd2 });
        window.dispatchEvent(event);
      });
    }
    else if(data.serialOut)
    {
      send.style.filter = "opacity(0.7)";
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

  #Terminal(data)
  {
    let div = _CN("div", {class:"msg_g"}, [], this.div);
    let msg = _CN("div", {class:"msg_r", style:"background:linear-gradient(to bottom, #445, #112, #445);color:springgreen;"}, [data], div);
  }
};

window.addEventListener("load", ()=>{
  TabChat.Init();
});