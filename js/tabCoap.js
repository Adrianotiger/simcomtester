class TabCoap
{
  Title = "Coap";
  
  constructor()
  {
    this.div = _CN("div", {class:"box tab"}, [_CN("h2", {}, ["COAP"])], Tabs.GetDiv());
    this.pdpidx = null;
    this.iptype = null;
    this.code = null;
    this.path = "";
    this.query = "";
    this.payload = "";
    
    setTimeout(()=>{
      this.Init();
    }, 200);
  }
  
  Init()
  {
    this.div.appendChild(Settings.GetGroupDiv("apn"));
    this.div.appendChild(Settings.GetGroupDiv("coap"));
    _CN("button", {style:"margin:1vh;"}, ["Check Status"], this.div).addEventListener("click", ()=>{
      this.CheckStatus();
    });
    
    let addDiv = AT_CNCFG.GetParamDiv("pdpidx", "Select PDPidx (Packet Data Protocol Identifier) to use for this COAP");
    this.div.appendChild(addDiv.div);
    this.pdpidx = addDiv.inp;
    
    addDiv = AT_CNCFG.GetParamDiv("iptype", "Select IP type", 1);
    this.div.appendChild(addDiv.div);
    this.iptype = addDiv.inp;
    
    addDiv = AT_CCOAPPARA.GetParamDiv("code", "Message request type", 2);
    this.div.appendChild(addDiv.div);
    this.code = addDiv.inp;
        
    addDiv = AT_CCOAPPARA.GetParamDiv("uripath", "Query relative URL (ex:'home/dir')");
    this.div.appendChild(addDiv.div);
    this.path = addDiv.inp;
    
    addDiv = AT_CCOAPPARA.GetParamDiv("uriquery", "Queries (ex:'topic=event&page=4')");
    this.div.appendChild(addDiv.div);
    this.query = addDiv.inp;
    
    addDiv = AT_CCOAPPARA.GetParamDiv("payload", "Payload, message to send");
    this.div.appendChild(addDiv.div);
    addDiv.inp.value = "Hello World!";
    this.payload = addDiv.inp;
    
    _CN("br", {}, [], this.div);
    _CN("button", {style:"margin:1vh;"}, ["Send Coap"], this.div).addEventListener("click", ()=>{
      this.SendCoap();
    });
    
  }
  
  Select()
  {
    
  }
  
  CheckStatus()
  {
    const event = new CustomEvent("cominfo", { detail: {info:""} });
    
    return new Promise((res, rej) => {
      ATScripts.CheckPIN(Settings.GetValue("pin", "pin")).then(()=>{
        ATScripts.CheckNetwork().then(()=>{
          
          ATScripts.CheckAPN(Settings.GetValue("apn", "url"), this.pdpidx.value).then(()=>{
            res(); // successfully tested pin, network and apn
          }).catch(e=>{this.#Error("NO APN", e); rej();});

        }).catch(e=>{this.#Error("NO CONNECTION", e); rej();});
      }).catch(e=>{this.#Error("PIN ERROR", e); rej();});
    });
  }
  
  SendCoap()
  {
    const event = new CustomEvent("cominfo", { detail: {info:""} });
    
    return new Promise((res, rej)=>{
      this.CheckStatus().then(()=>{

        event.detail.info = "Activate PDP";
        window.dispatchEvent(event);

        // activate pdp
        this.#ActivatePDP().then(()=>{
          event.detail.info = "Send PDP on idx " + this.pdpidx.value + ", ip: " + AT_CNACT.GetIp(parseInt(this.pdpidx.value));
          window.dispatchEvent(event);
          AT_CCOAPINIT.Execute().then(()=>{
            AT_CCOAPURL.Write([Settings.GetValue("coap", "url")]).then(()=>{
              this.#ExecuteCoap().then(()=>{
                
              }).catch(e=>{this.#Error("COAP Send ERROR", e, true); rej();});
            }).catch(e=>{this.#Error("AT_CCOAPURL ERROR", e, true); rej();});
          }).catch(e=>{this.#Error("AT_CCOAPINIT ERROR", e, true); rej();});
        }).catch(e=>{this.#Error("AT_CNACT ERROR", e); rej();}); 

      }).catch(e=>{this.#Error("CHECK ERROR", e); rej();});
    });
  }
  
  #ActivatePDP()
  {
    let index = parseInt(this.pdpidx.value);
    
    return new Promise((res, rej)=>{
      if(AT_CNACT.IsActive(index))
      {
        res();
      }
      else // not active, try to activate
      {
        ATScripts.CheckAPN(Settings.GetValue("apn", "url"), index).then(()=>{
          res(); // successfully tested pin, network and apn
        }).catch(e=>{this.#Error("NO APN", e); rej();});
      }
    });
  }
  
  #ExecuteCoap()
  {
    let params = [];
    params.push("code");
    params.push(this.code.value);
    
    if(this.path.value.trim().length > 0)
    {
      params.push("uri-path");
      params.push(0); // ascii
      params.push(this.path.value.trim());
    }
    
    if(this.query.value.trim().length > 0)
    {
      params.push("uri-query");
      params.push(0); // ascii
      params.push(this.query.value.trim());
    }
    
    params.push("payload");
    params.push(0); // ascii
    params.push(this.payload.value.trim());
    
    return new Promise((res, rej)=>{
      // Set params
      AT_CCOAPPARA.Write(params).then(()=>{
        // Send Coap
        AT_CCOAPACTION.Execute().then(()=>{
          // Wait for the response
          setTimeout(()=>{
            if(AT_CCOAPACTION.IsCoapReceived())
            {
              // Get and parse header
              AT_CCOAPHEAD.Write([AT_CCOAPACTION.GetMid(), 1]).then(()=>{

                // Everything ok! Terminate Coap and close
                AT_CCOAPTERM.Execute().then(()=>{
                  res();
                }).catch(()=>{res();});
              }).catch((e)=>{this.#Error("AT_COAPHEAD ERROR", e, true); rej();});
            }
            else
            {
              this.#Error("COAP No Answer Received", NULL, true);
              rej();
            }
          }, 500);
        }).catch((e)=>{this.#Error("AT_COAPACTION ERROR", e, true); rej();});
      }).catch((e)=>{this.#Error("AT_CCOAPPARA ERROR", e, true); rej();});
    });
  }
  
  #Error(msg, e, terminateCoap=false)
  {
    console.error("COAP ERROR", e);
    const event = new CustomEvent("cominfo", { detail: {error:msg, event:e} });
    window.dispatchEvent(event);
    
    if(terminateCoap)
    {
      AT_CCOAPTERM.Execute();
    }
  }
  
}

Tabs.AddTab(new TabCoap());