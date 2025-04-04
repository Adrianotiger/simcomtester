let AT_CNMP = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Preferred Mode Selection",
      example: "+CNMP: 38",
      cmd: "AT+CNMP",
      doc: "5.2.16"
    }); //true, true, false, true, "Preferred Mode Selection", "+CNMP: 38", "AT+CNMP", 1000);
    
    let enumMode = [];
    enumMode.push(new ATEnum(2, "Automatic"));
    enumMode.push(new ATEnum(13, "GSM only"));
    enumMode.push(new ATEnum(38, "LTE only"));
    enumMode.push(new ATEnum(51, "GSM and LTE only"));
    this.AddParam("mode", enumMode, "mode");

    //+CNMP: ((2-Automatic),(13-GSM Only),(38-LTE Only),(51-GSM And LTE Only))
    
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
};