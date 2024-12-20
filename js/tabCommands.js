class TabCommands
{
  Title = "Commands";

  constructor()
  {
    this.div = _CN("div", {class:"box tab"}, [_CN("h2", {}, ["Module"])], Tabs.GetDiv());
    
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
          ATScripts.Reboot().then(()=>{});
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

Tabs.AddTab(new TabCommands());