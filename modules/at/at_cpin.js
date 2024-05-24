let AT_CPIN = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true, 
      write: true,
      test: true,
      description: "Enter/Read PIN",
      example: "+CPIN: READY",
      cmd: "AT+CPIN",
      timeout: 5000
    });// true, true, false, true, "Enter/Read PIN", "+CPIN: READY", "AT+CPIN", 5000);
    //this.STATES = ["UNKNOWN", "READY", "SIM PIN", "SIM PUK", "PH_SIM PIN", "PH_SIM PUK", "PH_NET PIN", "SIM PIN2", "SIM PUK2"];
    let enumS = [];
    enumS.push(new ATEnum("UNKNOWN", "Unknown State"));
    enumS.push(new ATEnum("READY", "MT is not pending for any password"));
    enumS.push(new ATEnum("SIM PIN", "MT is waiting SIM PIN to be given"));
    enumS.push(new ATEnum("SIM PUK", "MT is waiting for SIM PUK to be given"));
    enumS.push(new ATEnum("PH_SIM PIN", "ME is waiting for phone to SIM card (antitheft)"));
    enumS.push(new ATEnum("PH_SIM PUK", "ME is waiting for SIM PUK (antitheft)"));
    enumS.push(new ATEnum("PH_NET PIN", "ME is waiting network personalization password to be given"));
    enumS.push(new ATEnum("SIM PIN2", "PIN2"));
    enumS.push(new ATEnum("SIM PUK2", "PUK2"));
    
    this.AddParam("code", enumS, "code");
    this.AddParam("pin", "string", "pin");
    this.AddParam("newpin", "string", "newpin");
    
    this.AddReadAnswerParam({code:null});
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    const value = this.GetValue();
    
    if(this.GetRequestType() == "read")
    {
      _CN("span", {}, [this.GetParam("code").GetValue(value.code)?.GetDescription()], div);
    }
  }
  
  
  GetState()
  {
    const value = this.GetValue();
    
    return value.code??"INVALID";
  }
  
  IsReady()
  {
    return this.GetState() == "READY";
  }
};