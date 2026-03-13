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

    this.cid = AT_CAOPEN.GetParamDiv("cid", "Select CID", 0);
    this.div.appendChild(this.cid.div);

    this.pdpindex = AT_CAOPEN.GetParamDiv("pdp_index", "Select PDP index", 0);
    this.div.appendChild(this.pdpindex.div);

    this.port = AT_CAOPEN.GetParamDiv("port", "Port (1-65535)", 15005);
    this.div.appendChild(this.port.div);
    let inpPort = this.port.div.getElementsByTagName("input")[0];
    inpPort.title = "tcpudp_port";
    Settings.AutoSaveChanges(inpPort);

    this.answer = AT_CAOPEN.GetParamDiv("recv_mode", "Receive Mode", 0);
    this.div.appendChild(this.answer.div);

    _CN("br", null, null, this.div);

    let inpAnswer = this.answer.div.getElementsByTagName("select")[0];
    inpAnswer.title = "tcpudp_answer";
    Settings.AutoSaveChanges(inpAnswer);

    let buttServer = _CN("button", null, ["Server"]);
    let buttClient = _CN("button", null, ["Client"]);
    let buttData = _CN("button", null, ["Data"]);
    let buttOptions = _CN("button", null, ["Options"]);
    let divServer = _CN("div", {style:"display:none;width:100%;"});
    let divClient = _CN("div", {style:"display:none;width:100%;"});
    let divData = _CN("div", {style:"display:none;width:100%;"});
    let divOptions = _CN("div", {style:"display:block;width:100%;"});

    buttServer.addEventListener("click", ()=>{
      divServer.style.display = "block";
      divClient.style.display = "none";
      divData.style.display = "none";
      divOptions.style.display = "none";
    });
    buttClient.addEventListener("click", ()=>{
      divServer.style.display = "none";
      divClient.style.display = "block";
      divData.style.display = "none";
      divOptions.style.display = "none";
    });
    buttData.addEventListener("click", ()=>{
      divServer.style.display = "none";
      divClient.style.display = "none";
      divData.style.display = "block";
      divOptions.style.display = "none";
    });
    buttOptions.addEventListener("click", ()=>{
      divServer.style.display = "none";
      divClient.style.display = "none";
      divData.style.display = "none";
      divOptions.style.display = "block";
    });

    _CN("table", {border:1}, [
      _CN("tr", null, [
        _CN("td", null, [buttServer]),
        _CN("td", null, [buttClient]),
        _CN("td", null, [buttData]),
        _CN("td", null, [buttOptions]),
      ]),
      _CN("tr", null, [
        _CN("td", {colspan:4}, [divServer, divClient, divData, divOptions])
      ])
    ], this.div);
    
    this.connTypeServer = AT_CASERVER.GetParamDiv("conn_type", "Connection Type", "UDP");

    let createServerButt = _CN("button", {style:"margin:1vh;"}, ["Create Server"]);
    createServerButt.addEventListener("click", ()=>{
      this.#CreateServer();
    });

    _CN("table", {}, [
      _CN("tr", {}, [
        _CN("td", {}, [this.connTypeServer.div])
      ]),
      _CN("tr", {}, [
        _CN("td", {}, [createServerButt])
      ])
    ], divServer);

    this.server = AT_CAOPEN.GetParamDiv("server", "Server name or IP", "TestServer");
    let inpServerName = this.server.div.getElementsByTagName("input")[0];
    inpServerName.title = "tcpudp_servername";
    Settings.AutoSaveChanges(inpServerName);

    this.connTypeClient = AT_CAOPEN.GetParamDiv("conn_type", "Connection Type", "UDP");
    //this.div.appendChild(this.connTypeClient.div);

    let connServerButt = _CN("button", {style:"margin:1vh;"}, ["Connect Server"]);
    connServerButt.addEventListener("click", ()=>{
      this.#ConnectServer();
    });

    _CN("table", {}, [
      _CN("tr", {}, [
        _CN("td", {}, [this.server.div])
      ]),
      _CN("tr", {}, [
        _CN("td", {}, [this.connTypeClient.div])
      ]),
      _CN("tr", {}, [
        _CN("td", {}, [connServerButt])
      ])
    ], divClient);

    let cdata = _CN("input", {type:"text", style:"margin:1vh;"});
    let csend = _CN("button", {style:"margin:1vh;"}, ["Send Data"]);
    csend.addEventListener("click", ()=>{
      this.SendUDP(cdata.value);
    });

    _CN("table", {}, [
      _CN("tr", {}, [
        _CN("td", {}, [cdata]),
        _CN("td", {}, [csend])
      ])
    ], divData);

    let cstate = _CN("button", {style:"margin:1vh;"}, ["Query State"]);
    cstate.addEventListener("click", ()=>{
      AT_CASTATE.Read();
    });

    let crecv = _CN("button", {style:"margin:1vh;"}, ["+CARECV"]);
    crecv.addEventListener("click", ()=>{
      AT_CARECV.Write([this.cid.inp.value, 512]);
    });

    let cclose = _CN("button", {style:"margin:1vh;"}, ["Close Connection"]);
    cclose.addEventListener("click", ()=>{
      AT_CACLOSE.Write([this.cid.inp.value]);
    });

    _CN("table", {}, [
      _CN("tr", {}, [
        _CN("td", {}, [cstate]),
        _CN("td", {}, [crecv]),
        _CN("td", {}, [cclose])
      ])
    ], divOptions);
  }
  
  Select()
  {
    
  }

  SendUDP(data)
  {
    const event = new CustomEvent("cominfo", { detail: {info:""} });
    let abortUDP = false;
    setTimeout(()=>{
      if(abortUDP) return;
      console.log("send data...", data);
      SIMSerial.SendData(data);
    }, 1000);
    
    AT_CASEND.Write([this.cid.inp.value, data.length]).then(()=>{
      abortUDP = true;
      event.detail.info = "UDP message sent";
      window.dispatchEvent(event);
    }).catch((e)=>{this.#Error("Unable to send message", e);});
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