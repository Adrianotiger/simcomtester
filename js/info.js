const TabInfo = new class
{
  #moduleInit = false;
  
  constructor()
  {
    this.div = _CN("div", {class:"box infotab"}, [_CN("h2", {}, ["Module Info"])]);
    
    this.prod_id = _CN("div", {class:"labelInfo"}, [_CN("label", {}, ["Product Identification: "]), _CN("i")], this.div);
    this.man_id = _CN("div", {class:"labelInfo"}, [_CN("label", {}, ["Manufacturer Identification: "]), _CN("i")], this.div);
    this.mod_id = _CN("div", {class:"labelInfo"}, [_CN("label", {}, ["Model Identification: "]), _CN("i")], this.div);
    this.glo_id = _CN("div", {class:"labelInfo"}, [_CN("label", {}, ["Global Identification: "]), _CN("i")], this.div);
    this.rev = _CN("div", {class:"labelInfo"}, [_CN("label", {}, ["Revision: "]), _CN("i")], this.div);
    
    this.divGit = _CN("div", {class:"box github"}, [], document.body);

    this.divImg = _CN("div", {class:"simModule"}, [_CN("span", {}, ["?"])], document.body);
  }
  
  Init()
  {
    document.body.appendChild(this.div);
    window.addEventListener("serial", (data)=>{
      this.#Serial(data.detail);
    });

    setTimeout(()=>{
      _CN("div", {}, [_CN("a", {href:"https://github.com/Adrianotiger/simcomtester", target:"_blank"}, ["Github Project"])], this.divGit);
      _CN("div", {}, [_CN("i", {}, ["ver 0.33 - 2024", _CN("br"), "© Adriano Petrucci"])], this.divGit);
    }, 500);
    
    let i = window.setInterval(()=>{
      if(SIMSerial && SIMSerial.IsConnected())
      {
        console.log("Serial ready!");
        window.clearInterval(i);
        document.body.removeChild(document.getElementsByClassName("loading")[0]);
        setTimeout(()=>{
          this.#InitModule();
        }, 500);
      }
    },500);
  }
  
  async #InitModule(retries = 0)
  {
    let isConnected = false;

    await AT.Execute().then(()=>{
      isConnected = true;
    }).catch((e)=>
    {
      const event = new CustomEvent("cominfo", { detail: {error:"No answer from module" + (retries<10 ? ", retry... (" + (9-retries) +")":"."), event:e} });
      window.dispatchEvent(event);
    });

    if(!isConnected && retries < 10)
    {
      setTimeout(()=>{
        SIMSerial.Disconnect();
        setTimeout(()=>{
          if(SIMSerial.IsConnected())
          {
            alert("Unable to disconnect port...");
          }
          else
          {
            SIMSerial.Connect();
            setTimeout(()=>{
              this.#InitModule(retries+1);
            }, 2000);
          }
        }, 2000);
      }, 100);
      return;
    }
    
    ATE0.Execute().then(()=>{
      ATI.Execute().then(()=>{
        AT_GMI.Execute().then(()=>{
          AT_GMM.Execute().then(()=>{
            AT_GOI.Execute().then(()=>{
              AT_GMR.Execute().then(()=>{
                this.#moduleInit = true;
                this.#InitOver();
              });
            });
          });
        });
      });
    }).catch(()=>
    {
      alert("Unable to execute AT* command");
    });
  }
  
  #InitOver()
  {
    this.divImg.getElementsByTagName("span")[0].textContent = this.glo_id.getElementsByTagName("i")[0].textContent;
    Tabs.Load();
  }
  
  #Serial(data)
  {
    console.log(data);
    switch(data.cmd?.GetCmd())
    {
      case "ATI":
        this.prod_id.getElementsByTagName("i")[0].textContent = ATI.GetValue();
        break;
      case "AT+GMI":
        this.man_id.getElementsByTagName("i")[0].textContent = AT_GMI.GetValue();
        break;
      case "AT+GMM":
        this.mod_id.getElementsByTagName("i")[0].textContent = AT_GMM.GetValue();
        break;
      case "AT+GOI":
        this.glo_id.getElementsByTagName("i")[0].textContent = AT_GOI.GetValue();
        break;
      case "AT+GMR":
        this.rev.getElementsByTagName("i")[0].textContent = AT_GMR.GetValue();
        break;
    }
  }
};

window.addEventListener("load", ()=>{
  TabInfo.Init();
});