class TabModule
{
  Title = "Module";

  constructor()
  {
    this.div = _CN("div", {class:"box tab"}, [_CN("h2", {}, ["Module"])], Tabs.GetDiv());
    
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
        "Product Id (ATI)", 
        ()=>{
          ATI.Execute().then(()=>{});
        },
        ATI)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Model Id (GMM)", 
        ()=>{
          AT_GMM.Execute().then(()=>{});
        },
        AT_GMM)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "TA Revision (GMR)", 
        ()=>{
          AT_GMR.Execute().then(()=>{});
        },
        AT_GMR)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "S/N Id (GSN)", 
        ()=>{
          AT_GSN.Execute().then(()=>{});
        },
        AT_GSN)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Mobile Subscriber (CIMI)", 
        ()=>{
          AT_CIMI.Execute().then(()=>{});
        },
        AT_CIMI)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Pin Status (CPIN)", 
        ()=>{
          AT_CPIN.Read().then(()=>{});
        },
        AT_CPIN)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Show ICCID (CCID)", 
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
        "Network Registration (CREG)", 
        ()=>{
          AT_CREG.Read().then(()=>{});
        },
        AT_CREG)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Signal Quality (CSQ)", 
        ()=>{
          AT_CSQ.Execute().then(()=>{});
        },
        AT_CSQ)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Mode Selection (CNMP)", 
        ()=>{
          AT_CNMP.Read().then(()=>{});
        },
        AT_CNMP)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "CAT/NB Selection (CMNB)", 
        ()=>{
          AT_CMNB.Read().then(()=>{});
        },
        AT_CMNB)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Inquiring UE (CPSI)", 
        ()=>{
          AT_CPSI.Read().then(()=>{});
        },
        AT_CPSI)
    );

    this.div.appendChild(
      Tabs.AddCmd(
        "GPRS Attachment (CGATT)", 
        ()=>{
          AT_CGATT.Read().then(()=>{});
        },
        AT_CGATT)
    );

    this.div.appendChild(
      Tabs.AddCmd(
        "Operator Selection (COPS)", 
        ()=>{
          AT_COPS.Read().then(()=>{});
        },
        AT_COPS)
    );

    this.div.appendChild(
      Tabs.AddCmd(
        "PDP Context (CGDCONT)", 
        ()=>{
          AT_CGDCONT.Read().then(()=>{});
        },
        AT_CGDCONT)
    );

    this.div.appendChild(
      Tabs.AddCmd(
        "Band (CBANDCFG)", 
        ()=>{
          AT_CBANDCFG.Read().then(()=>{});
        },
        AT_CBANDCFG)
    );
  }
  
  #InitModuleInfo()
  {
    _CN("h3", {}, ["Module Info"], this.div);
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Phone Activity (CPAS)", 
        ()=>{
          AT_CPAS.Execute().then(()=>{});
        },
        AT_CPAS)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Battery Charge (CBC)", 
        ()=>{
          AT_CBC.Execute().then(()=>{});
        },
        AT_CBC)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Free Memory (CFSGFRS)", 
        ()=>{
          AT_CFSGFRS.Read().then(()=>{});
        },
        AT_CFSGFRS)
    );
    
    this.div.appendChild(
      Tabs.AddCmd(
        "Get Clock (CCLK)", 
        ()=>{
          AT_CCLK.Read().then(()=>{});
        },
        AT_CCLK)
    );

    this.div.appendChild(
      Tabs.AddCmd(
        "Report Configuration (CURCCFG)", 
        ()=>{
          AT_CURCCFG.Read().then(()=>{});
        },
        AT_CURCCFG)
    );
  }
};

Tabs.AddTab(new TabModule());
