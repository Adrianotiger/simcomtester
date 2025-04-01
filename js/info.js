const TabInfo = new class
{
  #moduleInit = false;
  #moduleInfo = {};
  
  constructor()
  {
    this.div = _CN("div", {class:"box infotab"}, [_CN("h2", {}, ["Module Info"])]);
    
    this.prod_id = _CN("div", {class:"labelInfo"}, [_CN("label", {}, ["Product Identification: "]), _CN("i")], this.div);
    this.man_id = _CN("div", {class:"labelInfo"}, [_CN("label", {}, ["Manufacturer Identification: "]), _CN("i")], this.div);
    this.mod_id = _CN("div", {class:"labelInfo"}, [_CN("label", {}, ["Model Identification: "]), _CN("i")], this.div);
    this.glo_id = _CN("div", {class:"labelInfo"}, [_CN("label", {}, ["Global Identification: "]), _CN("i")], this.div);
    this.rev = _CN("div", {class:"labelInfo"}, [_CN("label", {}, ["Firmware: "]), _CN("i")], this.div);
    
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
      _CN("div", {}, [_CN("i", {}, ["ver 0.59 - 2025", _CN("br"), "© Adriano Petrucci"])], this.divGit);
    }, 500);
    
    let i = window.setInterval(()=>{
      if(SIMSerial && SIMSerial.IsConnected())
      {
        console.log("Serial ready!");
        window.clearInterval(i);
        document.body.removeChild(document.getElementsByClassName("loading")[0]);

        SIMSerial.SendData("\r\n\r\n"); 
        setTimeout(()=>{
          this.#InitModule();
        }, 500);
      }
    },500);
  }
  
  // Start inquiring module and possible commands
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
              SIMSerial.SendData("\r\n\r\n"); 
            }, 500);
            setTimeout(()=>{
              this.#InitModule(retries+1);
            }, 1000);
          }
        }, 1000);
      }, 100);
      return;
    }
    
    ATE0.Execute().then(()=>{
      ATI.Execute().then(()=>{
        AT_GMI.Execute().then(()=>{
          AT_GMM.Execute().then(()=>{
            AT_GOI.Execute().then(()=>{
              let module = AT_GOI.GetValue();
              if(module.search(/70[0-9]+0/))
              {
                fetch("modules/sim7080/info.json").then(r=>{return r.json();}).then(j=>{this.#moduleInfo = j});
                addATCommands("modules/sim7080/at.json");
                PDFManual.LoadPDF("./modules/manuals/SIM70x0_AT_107.pdf");

                window.dispatchEvent(
                  new CustomEvent("cominfo", { detail: {info:"Module 70*0 found! Loading extended AT commands and manual."} })
                );
              }
              else
              {
                window.dispatchEvent(
                  new CustomEvent("cominfo", { detail: {error:"Module " + module + " not found in this project."} })
                );
              }

              AT_GMR.Execute().then(()=>{
                let revision = AT_GMR.GetValue();
                if(this.#moduleInfo.firmware)
                {
                  console.log(this.#moduleInfo.firmware, revision);
                  const reg = new RegExp(this.#moduleInfo.firmware.version, 'g');
                  let m;
                  if ((m = reg.exec(revision)) !== null)
                  {
                    if(m.length == 2 && parseInt(m[2]) < parseInt(this.#moduleInfo.firmware.last))
                    {
                      window.dispatchEvent(
                        new CustomEvent("cominfo", { detail: {error:"Module firmware (" + m[1] + ") is out of date, there is a newer firmware: " + this.#moduleInfo.firmware.last} })
                      );
                    }
                    else if(m.length == 2)
                    {
                      window.dispatchEvent(
                        new CustomEvent("cominfo", { detail: {info:"Module firmware is " + m[1] + ". Up to date."} })
                      );
                    }
                  }
                }

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
