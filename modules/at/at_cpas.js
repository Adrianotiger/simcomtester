let AT_CPAS = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true, 
      test: true,
      description: "Phone Activity Status",
      example: "+CAPS: 0",
      cmd: "AT+CPAS"
    });// true, true, false, true, "Enter/Read PIN", "+CPIN: READY", "AT+CPIN", 5000);
    //this.STATES = ["UNKNOWN", "READY", "SIM PIN", "SIM PUK", "PH_SIM PIN", "PH_SIM PUK", "PH_NET PIN", "SIM PIN2", "SIM PUK2"];
    let enumS = [];
    enumS.push(new ATEnum(0, "Ready (MT allows commands from TA/TE)"));
    enumS.push(new ATEnum(3, "Ringing (MT is ready for commands from TA/TE, but the ringer is active)"));
    enumS.push(new ATEnum(4, "Call in progress (MT is ready for commands from TA/TE, but a call is in progress)"));
    
    this.AddParam("pas", enumS, "phone activity status");
    
    this.AddExeAnswerParam({pas:null});
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    const value = this.GetValue();
    
    if(this.GetRequestType() == "exe")
    {
      _CN("span", {}, [this.GetParam("pas").GetValue(value.pas)?.GetDescription()], div);
    }
  }
  
  
  GetStatus()
  {
    const value = this.GetValue();
    
    return value.code??"INVALID";
  }
  
  IsReady()
  {
    return this.GetState() == 0;
  }
};