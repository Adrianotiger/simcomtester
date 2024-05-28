let AT_CGNSPWR = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "GNSS Power Control",
      example: "+CGNSPWR: 0",
      cmd: "AT+CGNSPWR"
    }); 
    
    let enumM = [];
    enumM.push(new ATEnum(0, "Turn off GNSS power supply"));
    enumM.push(new ATEnum(1, "Turn on GNSS power supply"));
    
    this.AddParam("mode", enumM, "mode");
    
    this.AddWriteSendParam({mode:null});

    this.AddReadAnswerParam({mode:null});
  }

  ShowChat(div)
  {
    super.ShowChat(div);

    if(this.GetRequestType() == "read")
    {
      _CN("span", {}, [this.IsPowered() ? "ON" : "OFF"], div);
    }
  }
    
  IsPowered()
  {
    const value = this.GetValue();
    return (parseInt(value.mode) == 1);
  }
  
};