class TabSim
{
  Title = "SIM";
  #CheckpinButton = null;
  
  constructor()
  {
    this.div = _CN("div", {class:"box tab"}, [_CN("h2", {}, ["SIM"])], Tabs.GetDiv());
    this.messageTextMode = null;
    this.phoneNr = null;
    this.msg = null;
    
    setTimeout(()=>{
      this.Init();
      
    }, 200);
  }
  
  Init()
  {
    this.#CheckpinButton = _CN("button", {style:"margin:1vh;"}, ["Check PIN"], this.div);
    this.#CheckpinButton.addEventListener("click", ()=>{
      this.CheckPINState();
    });

    this.div.appendChild(Settings.GetGroupDiv("pin"));

    _CN("button", {style:"margin:1vh;"}, ["Enable PIN request"], this.div).addEventListener("click", (e)=>{
      this.EnablePIN();
    });
    _CN("button", {style:"margin:1vh;"}, ["Disable PIN"], this.div).addEventListener("click", (e)=>{
      this.DisablePIN();
    });
    _CN("button", {style:"margin:1vh;"}, ["Query PIN request"], this.div).addEventListener("click", (e)=>{
      this.QueryPIN();
    });
  }

  Select()
  {
    
  }

  CheckPINState()
  {
    this.#CheckpinButton.textContent = "Checking PIN...";
    AT_CPIN.Read().then(()=>{
      if(AT_CPIN.IsReady())
      {
        this.#CheckpinButton.textContent = "Check PIN ✅";
      }
      else if(AT_CPIN.GetState() == "SIM PIN")
      {
        this.#CheckpinButton.textContent = "Checking 📌...";
        AT_CPIN.Write([Settings.GetValue("pin", "pin")]).then(()=>{
          this.#CheckpinButton.textContent = "Check PIN ✅ (PIN activated)";
        }).catch((e)=>{
          this.#CheckpinButton.textContent = "Check PIN ❌";
          this.#Error("Wrong PIN", e);
        });
      }
    }).catch((e)=>{
      this.#CheckpinButton.textContent = "Check PIN ❌";
      this.#Error("Unable to read PIN", e);
    });
  }

  EnablePIN()
  {
    AT_CLCK.Write([`"SC"`, 2]).then(()=>{
      if(AT_CLCK.GetValue().status == 1)
      {
        window.dispatchEvent(new CustomEvent("cominfo", { detail: {info:"Pin request is already active"} }));
      }
      else
      {
        const pin = Settings.GetValue("pin", "pin");
        AT_CLCK.Write([`"SC"`, 1, `"${pin}"`]).then(()=>{
          let info = "PIN activated successfully - device will be rebooted...";
          window.dispatchEvent(new CustomEvent("cominfo", { detail: {info:info} }));
          setTimeout(()=>{
            this.#Reboot();
          }, 1000);
        }).catch((e)=>{
          this.#Error("Unable to lock SIM", e);
        });
      }
    }).catch((e)=>{
      this.#Error("Unable to query SIM", e);
    });
  }

  DisablePIN()
  {
    AT_CLCK.Write([`"SC"`, 2]).then(()=>{
      if(AT_CLCK.GetValue().status == 0)
      {
        window.dispatchEvent(new CustomEvent("cominfo", { detail: {info:"Pin request is already inactive"} }));
      }
      else
      {
        const pin = Settings.GetValue("pin", "pin");
        AT_CLCK.Write([`"SC"`, 0, `"${pin}"`]).then(()=>{
          let info = "PIN deactivated successfully - device will be rebooted...";
          window.dispatchEvent(new CustomEvent("cominfo", { detail: {info:info} }));
          setTimeout(()=>{
            this.#Reboot();
          }, 1000);
        }).catch((e)=>{
          this.#Error("Unable to unlock SIM", e);
        });
      }
    }).catch((e)=>{
      this.#Error("Unable to query SIM", e);
    });
  }

  #Reboot(requestPin = false)
  {
    let event = new CustomEvent("cominfo", { detail: {info:"no info"} })
    ATScripts.Reboot().then(()=>{
      setTimeout(()=>{
        this.CheckPINState();
      }, 500);
    }).catch(e=>{
      this.#Error("Unable to reboot device", e);    
    });
  }

  QueryPIN()
  {
    AT_CLCK.Write([`"SC"`, 2]).then(()=>{

    }).catch((e)=>{
      this.#Error("Unable to query SIM", e);
    });
  }

  #Error(msg, e, o = {})
  {
    console.error("SIM ERROR", e | "unknown");
    const event = new CustomEvent("cominfo", { detail: {error:msg, event:e} });
    window.dispatchEvent(event);
    
  }
  
}

Tabs.AddTab(new TabSim());