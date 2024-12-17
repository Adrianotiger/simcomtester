class TabTcpUdp
{
  Title = "TCP/UDP";

  constructor()
  {
    this.div = _CN("div", {class:"box tab"}, [_CN("h2", {}, ["TCP/UDP"])], Tabs.GetDiv());
    this.connTypeClient = null;
    this.connTypeServer = null;
    this.cid = null;
    this.pdpindex = null;
    this.server = null;
    this.port = null;
    this.answer = null;
    
    setTimeout(()=>{
      this.Init();
    }, 200);
  }

  Init()
  {
    this.div.appendChild(Settings.GetGroupDiv("apn"));

    _CN("button", {style:"margin:1vh;"}, ["Check Status"], this.div).addEventListener("click", ()=>{
      this.CheckStatus();
    });

    _CN("h2", {}, ["Create Server"], this.div);

    this.cid = AT_CAOPEN.GetParamDiv("cid", "Select CID", 0);
    this.div.appendChild(this.cid.div);

    this.pdpindex = AT_CAOPEN.GetParamDiv("pdp_index", "Select PDP index", 0);
    this.div.appendChild(this.pdpindex.div);

    this.port = AT_CAOPEN.GetParamDiv("port", "Port (1-65535)", 15005);
    this.div.appendChild(this.port.div);

    this.answer = AT_CAOPEN.GetParamDiv("recv_mode", "Receive Mode", 0);
    this.div.appendChild(this.answer.div);

    this.connTypeServer = AT_CASERVER.GetParamDiv("conn_type", "Connection Type", "UDP");
    this.div.appendChild(this.connTypeServer.div);

    _CN("button", {style:"margin:1vh;"}, ["Create Server"], this.div).addEventListener("click", ()=>{
      this.#CreateServer();
    });

    this.server = AT_CAOPEN.GetParamDiv("server", "Server name or IP", "TestServer");
    this.div.appendChild(this.server.div);

    this.connTypeClient = AT_CAOPEN.GetParamDiv("conn_type", "Connection Type", "TCP");
    this.div.appendChild(this.connTypeClient.div);

    _CN("button", {style:"margin:1vh;"}, ["Connect Server"], this.div).addEventListener("click", ()=>{
      this.#ConnectServer();
    });
  }
  
  Select()
  {
    
  }

  CheckStatus()
  {
    const event = new CustomEvent("cominfo", { detail: {info:""} });
    
    return new Promise((res, rej) => {
      event.detail.info = "Check PIN";
      window.dispatchEvent(event);

      // Check Pin
      AT_CPIN.Read().then(()=>{

        if(AT_CPIN.GetState() == "READY")
        {
          event.detail.info = "Check Network";
          window.dispatchEvent(event);
          // Check Signal
          AT_CSQ.Execute().then(()=>{
            if(AT_CSQ.GetRSSI_dBm() >= -100)
            {
              // Check Network
              this.#AttachGPRS().then(()=>{
                // Check Operator
                AT_COPS.Read().then(()=>{
                  if(AT_COPS.GetOperator().length > 1)
                  {
                    event.detail.info = "Check Apn";
                    window.dispatchEvent(event);
                    AT_CGNAPN.Execute().then(()=>{
                      if(Settings.GetValue("apn", "url") == AT_CGNAPN.GetApn())
                      {
                        event.detail.info = "HTTP-Connection successfully tested. Ready to be used.";
                        window.dispatchEvent(event);
                        res();
                      }
                      else
                      {
                        rej();
                      }
                    }).catch(e=>{this.#Error("NO APN", e); rej();});
                  }
                  else
                  {
                    rej();
                  }
                }).catch(e=>{this.#Error("NO OPERATOR", e); rej();});
              }).catch(e=>{this.#Error("NO GPRS", e); rej();});
            }
            else
            {
              rej();
            }
          }).catch(e=>{this.#Error("NO SIGNAL", e); rej();});
        }
      }).catch(e=>{this.#Error("PIN ERROR", e); rej();});
    });
  }

  #CreateServer()
  {
    const event = new CustomEvent("cominfo", { detail: {info:""} });
    
    return new Promise((res, rej)=>{
      this.CheckStatus().then(()=>{
        this.#ActivatePDP(this.pdpindex.value).then(()=>{
          // {cid:null, pdp_index:null, conn_type:null, server:null, port:null, recv_mode:null}
          AT_CASERVER.Write([this.cid.inp.value, this.pdpindex.inp.value, "\"" + this.connTypeServer.inp.value + "\"", this.port.inp.value, this.answer.inp.value]).then(()=>{
            // Server created ?
          }).catch(e=>{this.#Error("CASERVER ERROR", e); rej();});
        }).catch(e=>{this.#Error("PDP ERROR", e); rej();});
      }).catch(e=>{this.#Error("CHECK ERROR", e); rej();});
    });
  }

  #ConnectServer()
  {
    const event = new CustomEvent("cominfo", { detail: {info:""} });
    
    return new Promise((res, rej)=>{
      this.CheckStatus().then(()=>{
        this.#ActivatePDP(this.pdpindex.value).then(()=>{
          // {cid:null, pdp_index:null, conn_type:null, server:null, port:null, recv_mode:null}
          AT_CAOPEN.Write([this.cid.inp.value, this.pdpindex.inp.value, "\"" + this.connTypeClient.inp.value + "\"", "\"" + this.server.inp.value + "\"", this.port.inp.value, this.answer.inp.value]).then(()=>{
            // Server connected ?
          }).catch(e=>{this.#Error("CAOPEN ERROR", e); rej();});
        }).catch(e=>{this.#Error("PDP ERROR", e); rej();});
      }).catch(e=>{this.#Error("CHECK ERROR", e); rej();});
    });
  }

  #ActivatePDP(index=0)
  {    
    return new Promise((res, rej)=>{
      // Check if already active
      AT_CNACT.Read().then(()=>{
        if(AT_CNACT.IsActive(index))
        {
          res();
        }
        else // not active, try to activate
        {
          AT_CNACT.Write([index, 1]).then(()=>{
            AT_CNACT.Read().then(()=>{
              if(AT_CNACT.IsActive(index))
              {
                res();
              }
            }).catch(e=>{this.#Error("AT_CNACT ERROR", e); rej();});
          }).catch(e=>{this.#Error("AT_CNACT ERROR", e); rej();});
        }
      }).catch(e=>{this.#Error("AT_CNACT ERROR", e); rej();});
    });
  }

  #AttachGPRS()
  {
    return new Promise((acc, rej)=>{
      AT_CGATT.Read().then(()=>{
        if(AT_CGATT.IsAttached())
        {
          acc();
        }
        else
        {
          AT_CGATT.Attach().then(()=>{
            AT_CGATT.Read().then(()=>{
              if(AT_CGATT.IsAttached())
              {
                acc();
              }
              else
              {
                rej();
              }
            }).catch(()=>rej());
          }).catch(()=>rej());
        }
      }).catch(()=>rej());
    });
  }
  
  #Error(msg, e, o = {})
  {
    console.error("HTTPS ERROR", e);
    const event = new CustomEvent("cominfo", { detail: {error:msg, event:e} });
    window.dispatchEvent(event);
    
    if(o.terminateFS)
    {
      AT_CFSTERM.Execute();
    }
    
    if(o.disconnect)
    {
      AT_SHDISC.Execute();
    }
  }
}

Tabs.AddTab(new TabTcpUdp());