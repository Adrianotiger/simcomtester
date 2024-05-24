class TabModule
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
    this.#InitGlobalInfo();
    
    this.#InitNetworkInfo();
    
    this.#InitModuleInfo();
    
  }
  
  Select()
  {
    
  }
  
  #InitGlobalInfo()
  {
    _CN("h3", {}, ["Global Info"], this.div);
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Product Id", 
        ()=>{
          ATI.Execute().then(()=>{});
        },
        ATI)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Model Id", 
        ()=>{
          AT_GMM.Execute().then(()=>{});
        },
        AT_GMM)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "TA Revision", 
        ()=>{
          AT_GMR.Execute().then(()=>{});
        },
        AT_GMR)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "S/N Id", 
        ()=>{
          AT_GSN.Execute().then(()=>{});
        },
        AT_GSN)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Mobile Subscriber", 
        ()=>{
          AT_CIMI.Execute().then(()=>{});
        },
        AT_CIMI)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Pin Status", 
        ()=>{
          AT_CPIN.Read().then(()=>{});
        },
        AT_CPIN)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Show ICCID", 
        ()=>{
          AT_CCID.Execute().then(()=>{});
        },
        AT_CCID)
    );
  }
  
  #InitNetworkInfo()
  {
    _CN("h3", {}, ["Network Info"], this.div);
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Network Registration", 
        ()=>{
          AT_CREG.Read().then(()=>{});
        },
        AT_CREG)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Signal Quality", 
        ()=>{
          AT_CSQ.Execute().then(()=>{});
        },
        AT_CSQ)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Mode Selection", 
        ()=>{
          AT_CNMP.Read().then(()=>{});
        },
        AT_CNMP)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "CAT/NB Selection", 
        ()=>{
          AT_CMNB.Read().then(()=>{});
        },
        AT_CMNB)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Inquiring UE", 
        ()=>{
          AT_CPSI.Read().then(()=>{});
        },
        AT_CPSI)
    );
  }
  
  #InitModuleInfo()
  {
    _CN("h3", {}, ["Module Info"], this.div);
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Phone Activity", 
        ()=>{
          AT_CPAS.Execute().then(()=>{});
        },
        AT_CPAS)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Battery Charge", 
        ()=>{
          AT_CBC.Execute().then(()=>{});
        },
        AT_CBC)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Free Memory", 
        ()=>{
          AT_CFSGFRS.Read().then(()=>{});
        },
        AT_CFSGFRS)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Get Clock", 
        ()=>{
          AT_CCLK.Read().then(()=>{});
        },
        AT_CCLK)
    );
  }
};

