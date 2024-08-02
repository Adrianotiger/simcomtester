let AT_CMGF = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true, 
      write: true,
      test: true,
      description: "Select SMS Message Format",
      example: "+CMGF: 1",
      cmd: "AT+CMGF",
      doc: "4.2.2"
    });// true, true, false, true, "Enter/Read PIN", "+CPIN: READY", "AT+CPIN", 5000);
    //this.STATES = ["UNKNOWN", "READY", "SIM PIN", "SIM PUK", "PH_SIM PIN", "PH_SIM PUK", "PH_NET PIN", "SIM PIN2", "SIM PUK2"];
    let enumM = [];
    enumM.push(new ATEnum(0, "PDU mode"));
    enumM.push(new ATEnum(1, "Text mode"));
    
    this.AddParam("mode", enumM, "mode");
    
    this.AddReadAnswerParam({mode:null});
    this.AddWriteSendParam({mode:null});
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    const value = this.GetValue();
    
    if(this.GetRequestType() == "read")
    {
      _CN("span", {}, [this.GetParam("mode").GetValue(value.mode)?.GetDescription()], div);
    }
  }
  
  
  GetMode()
  {
    const value = this.GetValue();
    
    return value.mode??"INVALID";
  }
  
  IsTextMode()
  {
    return this.GetMode() == 1;
  }
};