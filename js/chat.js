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
        SIMSerial.Send(this.chat.value + "\r\n", null).then(()=>{
          // Successfully sent.
        }).catch(err=>{
          console.warn("ERROR SENDING OVER CHAT:", err);
        });
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

    if(data.cmd)
    {
      if(data.answer.trim().startsWith("+"))
      {
        const cmd = data.cmd;
        const cmdd = data.answer.trim().split("\r")[0].trim();
        let info = _CN("span", {class:"msg_a"}, ["i"], div);
        let bubble = null;
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

            bubble = _CN("div", {class:"msg_bubble", style:`left:${e.layerX}px;`}, [], div);
            _CN("b", {}, [cmd.GetDescription()], bubble);
            let table = _CN("table", {border:1}, [], bubble);
            const lst = cmd.Comma2List(cmdd.substring(cmdd.indexOf(":") + 1));
            let lstindex = 0;
            let defi = 0;
            for(let j=0;j<params.length;j++) if(Object.keys(params[j]).length == lst.length) defi = j;
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
                  if(vals.replace('"', '')==t.GetValue()) o.selected = true;
                });
              }
              _CN("tr",{}, [
                _CN("td",{}, [px.GetName()]),
                _CN("td",{}, [val]),
                _CN("td",{}, [px.GetDescription()])
              ], table);
            });

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