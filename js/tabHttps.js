class TabHttps
{
  Title = "HTTPs";

  constructor()
  {
    this.div = _CN("div", {class:"box tab"}, [_CN("h2", {}, ["HTTPs"])], Tabs.GetDiv());
    this.ctxindex = null;
    this.sslver = null;
    this.url = null;
    this.path = null;
    this.type = null;
    this.headers = null;
    this.params = null;
    
    
    setTimeout(()=>{
      this.Init();
    }, 200);
  }
  
  Init()
  {
    this.div.appendChild(Settings.GetGroupDiv("apn"));
    this.div.appendChild(Settings.GetGroupDiv("ssl"));
    
    _CN("button", {style:"margin:1vh;"}, ["Check Status"], this.div).addEventListener("click", ()=>{
      this.CheckStatus();
    });
    
    _CN("button", {style:"margin:1vh;"}, ["Upload Certificate"], this.div).addEventListener("click", ()=>{
      this.UploadSSL();
    });
    
    let addDiv = AT_CSSLCFG.GetParamDiv("ctxindex", "Select CTX Index", 1);
    this.div.appendChild(addDiv.div);
    this.ctxindex = addDiv.inp;
    
    addDiv = AT_CSSLCFG.GetParamDiv("sslversion", "Select SSL Version", 3);
    this.div.appendChild(addDiv.div);
    this.sslver = addDiv.inp;
    
    this.url = _CN("input", {type:"text", value:"", title:"https_url"});
    _CN("div", {class:"paramdiv"}, [_CN("p", {}, ["https-url to make request (ex: https://www.xxx.ch)", this.url])], this.div);
    Settings.AutoSaveChanges(this.url);
    
    this.path = _CN("input", {type:"text", value:"", title:"https_path"});
    _CN("div", {class:"paramdiv"}, [_CN("p", {}, ["https-path to make request (ex: directory/index.php)", this.path])], this.div);
    Settings.AutoSaveChanges(this.path);
    
    addDiv = AT_SHREQ.GetParamDiv("type", "Request type", 3);
    this.div.appendChild(addDiv.div);
    this.type = addDiv.inp;
    
    this.headers = _CN("textarea", {title:"https_headers", rows:5}, []);
    _CN("div", {class:"paramdiv"}, [_CN("p", {}, ["1 header for line (ex: Content-Type=application/x- www-form-urlencoded)", this.headers])], this.div);
    Settings.AutoSaveChanges(this.headers);
    
    this.params = _CN("textarea", {title:"https_params", rows:5}, []);
    _CN("div", {class:"paramdiv"}, [_CN("p", {}, ["1 parameter for line (ex: topic=my cats)", this.params])], this.div);
    Settings.AutoSaveChanges(this.params);
    
    _CN("button", {style:"margin:1vh;"}, ["SEND HTTPS REQUEST"], this.div).addEventListener("click", ()=>{
      this.SendHttps();
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
  
  UploadSSL()
  {
    const event = new CustomEvent("cominfo", { detail: {info:""} });
    const FILE_NAME = Settings.GetValue("ssl", "name");
    
    return new Promise((res, rej)=>{
      AT_CFSINIT.Execute().then(()=>{
        const cer = Settings.GetValue("ssl", "cer");
        if(cer.length >= 10240)
        {
          this.#Error("Certificate is bigger than 10k!", null, {terminateFS:true});
          rej();
          return;
        }
        // try to delete the file, if it exists
        AT_CFSDFILE.Write([3, FILE_NAME]).finally(()=>{
          setTimeout(()=>{
            SIMSerial.SendData(cer);
          }, 500);
          // write file, 500ms after sending command
          AT_CFSWFILE.Write([3, FILE_NAME, 1, cer.length, 2000]).then(()=>{
            // terminate file system
            AT_CFSTERM.Execute().finally(()=>{
              AT_CSSLCFG.Write(["CONVERT", 2, FILE_NAME]).then(()=>{
                
                event.detail.info = "SSL successfully uploaded and configured.";
                window.dispatchEvent(event);
                
              }).catch(e=>{this.#Error("SSL ERROR", e); rej();});
            });
          }).catch(e=>{this.#Error("CFSWFILE ERROR", e, {terminateFS:true}); rej();});
        });
      }).catch(e=>{this.#Error("FS NOT ACCESSIBLE", e, {terminateFS:true}); rej();});
    });
  }
  
  #SendHttpsValues(headers, step = 0)
  {
    if(step == 0)
    {
      return new Promise((res, rej)=>{
        if(headers)
        {
          AT_SHCHEAD.Execute().then(()=>{
            this.#SendHttpsValues(true, 1).then(()=>{
              res();
            }).catch(e=>{this.#Error("HEADs ERROR", e); rej();});
          }).catch(e=>{this.#Error("AT_SHCHEAD ERROR", e); rej();});
        }
        else
        {
          AT_SHCPARA.Execute().then(()=>{
            this.#SendHttpsValues(false, 1).then(()=>{
              res();
            }).catch(e=>{this.#Error("PARAMs ERROR", e); rej();});
          }).catch(e=>{this.#Error("AT_SHCPARA ERROR", e); rej();});
        }
      });
    }
    else
    {
      return new Promise((res, rej)=>{
        if(headers)
        {
          let header_arr = [];
          this.headers.value.split("\n").forEach(h=>{if(h.length > 2) header_arr.push(h);});
          if(step > header_arr.length) 
          {
            res();
            return;
          }
          const header = header_arr[step-1].trim().split("=", 2);
          AT_SHAHEAD.Write(['"' + header[0] + '"', '"' + header[1] + '"']).then(()=>{
            
            this.#SendHttpsValues(true, step+1).then(()=>{
              res();
            }).catch(e=>{this.#Error("HEADs ERROR", e); rej();});
            
          }).catch(e=>{this.#Error("AT_SHAHEAD ERROR", e); rej();});
        }
        else
        {
          let params = [];
          this.params.value.split("\n").forEach(p=>{if(p.length > 2) params.push(p);});
          if(step > params.length) 
          {
            res();
            return;
          }
          const param = params[step-1].trim().split("=", 2);
          AT_SHPARA.Write(['"' + param[0] + '"', '"' + param[1] + '"']).then(()=>{
            
            this.#SendHttpsValues(false, step+1).then(()=>{
              res();
            }).catch(e=>{this.#Error("PARAMs ERROR", e); rej();});
            
          }).catch(e=>{this.#Error("AT_SHPARA ERROR", e); rej();});
        }
      });
    }
  }
  
  SendHttps()
  {
    const event = new CustomEvent("cominfo", { detail: {info:""} });
    
    return new Promise((res, rej)=>{
      this.CheckStatus().then(()=>{
        this.#ActivatePDP().then(()=>{
          event.detail.info = "Configure SSL";
          window.dispatchEvent(event);
          this.#SetCertificate().then(()=>{
            // configure apn
            
            AT_SHCONF.Write(["URL", this.url.value]).then(()=>{
              AT_SHCONF.Write(["BODYLEN", this.params.value.length + 100]).then(()=>{
                AT_SHCONF.Write(["HEADERLEN", this.headers.value.length + 100]).then(()=>{
                  AT_SHCONN.Execute().then(()=>{
                    AT_SHSTATE.Read().then(()=>{
                      if(!AT_SHSTATE.IsConnected())
                      {
                        this.#Error("Unable to connect", null, {disconnect:true}); 
                        rej(); 
                      }
                      // send all headers
                      this.#SendHttpsValues(true).then(()=>{
                        // send all params
                        this.#SendHttpsValues(false).then(()=>{
                          
                          AT_SHREQ.Write([this.path.value, this.type.value]).then(()=>{
                            
                            if(/*AT_SHREQ.GetStatusCode() == 200 && */AT_SHREQ.GetDataLength() > 0)
                            {
                              AT_SHREAD.Write([0, AT_SHREQ.GetDataLength()]).then(()=>{

                                AT_SHDISC.Execute();

                                event.detail.info = "Request successfull.";
                                window.dispatchEvent(event);

                              }).catch(e=>{this.#Error("SHREQ ERROR", e, {disconnect:true}); rej();});
                            }
                            else
                            {
                              this.#Error("Server ERROR", null, {disconnect:true}); 
                              rej();
                            }
                          }).catch(e=>{this.#Error("SHREQ ERROR", e, {disconnect:true}); rej();});
                          
                        }).catch(e=>{this.#Error("HEADERS ERROR", e, {disconnect:true}); rej();});
                      }).catch(e=>{this.#Error("HEADERS ERROR", e, {disconnect:true}); rej();});
                      
                    }).catch(e=>{this.#Error("AT_SHSTATE ERROR", e, {disconnect:true}); rej();});
                  }).catch(e=>{this.#Error("AT_SHCONN ERROR", e, {disconnect:true}); rej();});
                }).catch(e=>{this.#Error("AT_SHCONF HEADERLEN ERROR", e); rej();});
              }).catch(e=>{this.#Error("AT_SHCONF BODYLEN ERROR", e); rej();});
            }).catch(e=>{this.#Error("AT_SHCONF URL ERROR", e); rej();});
              
          }).catch(e=>{this.#Error("CErtificate ERROR", e); rej();});
        }).catch(e=>{this.#Error("PDP ERROR", e); rej();});
      }).catch(e=>{this.#Error("CHECK ERROR", e); rej();});
    });
  }
  
  #SetCertificate()
  {
    return new Promise((res, rej)=>{
      AT_CCLK.Read().then(()=>{
        // Set time, if time is not right
        if(AT_CCLK.GetTime().getFullYear() != (new Date()).getFullYear())
        {
          AT_CCLK.Write([AT_CCLK.ConvertTime(new Date())]).then(()=>{
            AT_CCLK.Read().then(()=>{
              if(AT_CCLK.GetTime().getFullYear() == (new Date()).getFullYear())
              {
                return this.#SetCertificate();
              }
              this.#Error("AT_CCLK ERROR", "Unable to set clock");
              rej();
            }).catch(e=>{this.#Error("AT_CCLK ERROR", e); rej();});
          });
        }
        else
        {
          AT_CSSLCFG.Write(["SSLVERSION", this.ctxindex.value, this.sslver.value]).then(()=>{
              AT_SHSSL.Write([this.ctxindex.value, /*Settings.GetValue("ssl", "name")*/"\"\""]).then(()=>{
                const url = this.url.value;
                if((url.match(/./g) || []).length < 2)
                {
                  res();
                }
                else // set sni
                {
                  let domain = url.substring(url.indexOf("//") + 2);
                  if(domain.indexOf("/") > 0) domain = domain.substring(domain.indexOf("/"));
                  //AT+CSSLCFG="sni",1,"goldengames.ch"
                  AT_CSSLCFG.Write(["SNI", this.ctxindex.value, domain]).then(()=>{
                    res();
                  }).catch(e=>{this.#Error("AT_CSSLCFG SNI ERROR", e); rej();});
                }
              }).catch(e=>{this.#Error("AT_SHSSL ERROR", e); rej();});
          }).catch(e=>{this.#Error("AT_CSSLCFG SSLVERSION ERROR", e); rej();});
        }
      }).catch(e=>{this.#Error("AT_CCLK ERROR", e); rej();});
    });
  }
  
  #ActivatePDP()
  {
    let index = 0;
    
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

Tabs.AddTab(new TabHttps());