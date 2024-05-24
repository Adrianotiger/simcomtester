class TabCommands
{
  constructor(div)
  {
    this.div = _CN("div", {class:"box tab"}, [_CN("h2", {}, ["Module"])], div);
    
    setTimeout(()=>{
      this.Init();
    }, 200);
  }
  
  Init()
  {    
    this.#InitModuleCommands();
    
  }
  
  Select()
  {
    
  }
  
  #InitModuleCommands()
  {
    _CN("h3", {}, ["Commands"], this.div);
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Reboot", 
        ()=>{
          AT_CREBOOT.Execute().then(()=>{
            let step = 0;
            const event = new CustomEvent("cominfo", { detail: {info:"Reconnecting Module..."} });
            window.dispatchEvent(event);
            let i = setInterval(()=>{
              if(step == 0)
              {
                if(!SIMSerial.IsConnected())
                {
                  SIMSerial.Connect();
                  step = 1;
                }
              }
              else if(step == 1)
              {
                if(SIMSerial.IsConnected())
                {
                  step = 2;
                  clearInterval(i);
                  ATE0.Execute().then(()=>{
                    event.detail.info = "Connected!";
                    window.dispatchEvent(event);
                  });
                }
              }
            }, 2000);
          });
        },
        AT_CREBOOT)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Test (AT)", 
        ()=>{
          AT.Execute().then(()=>{});
        },
        AT)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Echo Off", 
        ()=>{
          ATE0.Execute().then(()=>{});
        },
        ATE0)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Echo On", 
        ()=>{
          ATE1.Execute().then(()=>{});
        },
        ATE1)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Show Error messages", 
        ()=>{
          AT_CMEE.Write([2]).then(()=>{});
        },
        AT_CMEE)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Disable Error messages", 
        ()=>{
          AT_CMEE.Write([0]).then(()=>{});
        },
        AT_CMEE)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Set Time", 
        ()=>{
          let f = AT_CCLK.ConvertTime(new Date());
          AT_CCLK.Write([f]).then(()=>{});
        },
        AT_CCLK)
    );
  }
};

