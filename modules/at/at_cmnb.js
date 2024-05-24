let AT_CMNB = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Preferred Selection between CAT-M and NB-IoT",
      example: "+CMNB: 2",
      cmd: "AT+CMNB"
    }); //true, true, false, true, "Preferred Selection between CAT-M and NB-IoT", "+CMNB: 2", "AT+CMNB", 1000);
    
    let enumMode = [];
    enumMode.push(new ATEnum(1, "CAT-M"));
    enumMode.push(new ATEnum(2, "NB-IoT"));
    enumMode.push(new ATEnum(3, "CAT-M and NB-IoT"));
    this.AddParam("mode", enumMode, "mode");
    
    this.AddReadAnswerParam({mode:null});
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
};