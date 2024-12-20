const ATScripts = new class
{
 constructor()
  {
  }

  CheckPIN(pinCode = null)
  {
    const event = new CustomEvent("cominfo", { detail: {info:""} });

    return new Promise((res, rej) => {
      event.detail.info = "Check PIN";
      window.dispatchEvent(event);

      // Check Pin
      AT_CPIN.Read().then(()=>{
        switch(AT_CPIN.GetState())
        {
            // module is ready
          case "READY": 
            event.detail.info = "PIN is OK";
            window.dispatchEvent(event);
            res();
            return;
            // sim is locked with a pin
          case "SIM READY": 
            event.detail.info = "insert PIN";
            window.dispatchEvent(event);

            AT_CPIN.Write({pinCode}).then(()=>{
              event.detail.info = "PIN OK";
              window.dispatchEvent(event);
              res();
            }).catch((e)=>{
              event.detail.info = "invalid PIN";
              window.dispatchEvent(event);
              rej();
            });
            
            return;
        }
        rej();
        
      }).catch(e=>{this.#Error("PIN ERROR - STATE: " + AT_CPIN.GetState(), e); rej();});
    });
  }

  CheckNetwork()
  {
    const event = new CustomEvent("cominfo", { detail: {info:""} });

    return new Promise((res, rej) => {
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
                event.detail.info = "Network is OK";
                window.dispatchEvent(event);
                res();
              }
              else
              {
                this.#Error("Wrong Operator", e); 
                rej();
              }
            }).catch(e=>{this.#Error("NO Operator", e); rej();});
          }).catch(e=>{this.#Error("NO GPRS", e); rej();});
        }
        else
        {
          this.#Error("POOR SIGNAL", e);
          rej();
        }
      }).catch(e=>{this.#Error("NO SIGNAL", e); rej();});
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

    // Be sure to check Network first
  CheckAPN(apn, pdpidx=0)
  {
    const event = new CustomEvent("cominfo", { detail: {info:""} });

    return new Promise((res, rej) => {
      event.detail.info = "Check APN";
      window.dispatchEvent(event);

      AT_CGNAPN.Execute().then(()=>{
        if(apn == AT_CGNAPN.GetApn())
        {
          // check Network Active
          AT_CNACT.Read().then(()=>{
            if(!AT_CNACT.IsActive(pdpidx)) // all networks are inactive, try to activate network pdpidx
            {
              AT_CNACT.Write([pdpidx, 1]).then(()=>{
                setTimeout(()=>{
                  AT_CNACT.Read().then(()=>{
                    if(!AT_CNACT.IsActive(pdpidx)) // still not active, why?
                    {
                      this.#Error("Can't activate network " + pdpidx, 0); 
                      rej(); 
                    }
                    else
                    {
                      res();
                    }
                  }).catch(e=>{this.#Error("Network Active Request failed (2)", e); rej();});
                }, 1000);
              }).catch(e=>{this.#Error("Unable to activate Network", e); rej();});
            }
            else
            {
              event.detail.info = "APN successfully tested. Ready to be used.";
              window.dispatchEvent(event);
              res();
            }
          }).catch(e=>{this.#Error("Network Active Request failed", e); rej();});
        }
        else
        {
          this.#Error("Please set the URL for your APN", false)
          rej();
        }
      }).catch(e=>{this.#Error("NO APN", e); rej();});
    });
  }

  Reboot()
  {
    return new Promise((res, rej) => {
        // Execute Reboot and wait at lease 2 seconds
      AT_CREBOOT.Execute().then(()=>{
        let step = 0;
        const event = new CustomEvent("cominfo", { detail: {info:"Reconnecting Module..."} });
        window.dispatchEvent(event);
        let i = setInterval(()=>{
          if(step == 1)
          {
            if(!SIMSerial.IsConnected())
            {
              SIMSerial.Connect();
            }
            // Serial should now be connected
            const event = new CustomEvent("cominfo", { detail: {info:"Connected"} });
            window.dispatchEvent(event);
            step = 1;
          }
          else if(step == 2)
          {
            // Send new line, to be sure the next AT command will be detected
            step++
            SIMSerial.SendData("\r\n\r\n"); 
          }
          else if(step >= 3)
          {
            // At this point, after 4 seconds, the module should be ready. set echo Off and test it
            clearInterval(i);            
            ATE0.Execute().then(()=>{
              const event = new CustomEvent("cominfo", { detail: {info:"Module is ready"} });
              window.dispatchEvent(event);
              res();
            }).catch(e=>{
              const event = new CustomEvent("cominfo", { detail: {error:"Unable to connect module", event:e} });
              window.dispatchEvent(event);
              rej();
            });
          }
          step++;
        }, 1000);
      }).catch(e=>{
        const event = new CustomEvent("cominfo", { detail: {error:"Unable to reboot module", event:e} });
        window.dispatchEvent(event);
        rej();
      });
    });
  }

  #Error(msg, e)
  {
    console.error("ATSCRIPTS ERROR", e);
    const event = new CustomEvent("cominfo", { detail: {error:msg, event:e} });
    window.dispatchEvent(event);
  }
};