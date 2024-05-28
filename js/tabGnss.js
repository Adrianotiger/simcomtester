class TabGnss
{  

  Title = "GNSS";

  constructor()
  {
    this.div = _CN("div", {class:"box tab"}, [_CN("h2", {}, ["GNSS"])], Tabs.GetDiv());
    this.isGnssPowered = null;
    
    setTimeout(()=>{
      this.Init();
      
      window.addEventListener("serial", (data)=>{
        if(data.detail.cmd?.GetCmd() == "AT+CGNSPWR")
        {
          this.isGnssPowered = AT_CGNSPWR.IsPowered();
        }
      });
    }, 200);
  }
  
  Init()
  {
    //this.div.appendChild(Settings.GetGroupDiv("apn"));
    //this.div.appendChild(Settings.GetGroupDiv("ssl"));
    
    this.div.appendChild(
      Tabs.AddCmd(
        "GET Power Mode", 
        ()=>{
          AT_CGNSPWR.Read().then(()=>{});
        },
        AT_CGNSPWR)
    );

    _CN("br", {}, [], this.div);

    _CN("button", {style:"margin:1vh;"}, ["POWER ON GNSS"], this.div).addEventListener("click", ()=>{
      AT_CGNSPWR.Write([1]);
    });

    _CN("button", {style:"margin:1vh;"}, ["POWER OFF GNSS"], this.div).addEventListener("click", ()=>{
      AT_CGNSPWR.Write([0]);
    });

    _CN("br", {}, [], this.div);

    _CN("button", {style:"margin:1vh;"}, ["GET GNSS INFO"], this.div).addEventListener("click", ()=>{
      AT_CGNSINF.Execute();
    });

    

  }
  
  Select()
  {
    if(this.isGnssPowered == null)
    {
      AT_CGNSPWR.Read();
    }
  }
  
  
  #Error(msg, e, o = {})
  {
    console.error("GNSS ERROR", e);
    const event = new CustomEvent("cominfo", { detail: {error:msg, event:e} });
    window.dispatchEvent(event);
    
  }
  
}

Tabs.AddTab(new TabGnss());