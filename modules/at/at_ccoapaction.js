let AT_CCOAPACTION = new class extends ATBase
{
  #packSize = 0;
  #payloadSize = 0;
  
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true, 
      exe: true,
      test: true,
      description: "Operate CoAP Object",
      example: "+CCOAPACTION: 0,1",
      cmd: "AT+CCOAPACTION"
    });//false, true, true, true, "Operate CoAP Object", "+CCOAPACTION: 0,1", "AT+CCOAPACTION", 1000);
    
    let enumT = [];
    enumT.push(new ATEnum(4, "Query current receiving queue information"));
    enumT.push(new ATEnum(5, "Clear the receive queue"));
    enumT.push(new ATEnum(6, "Reconnect and send packet"));
    
    let enumE = [];
    enumE.push(new ATEnum(0, "No errors"));
    enumE.push(new ATEnum(1, "receive queue is full"));
    enumE.push(new ATEnum(2, "mid CoAP response packet receives timeout"));
    enumE.push(new ATEnum(3, "CoAP socket error"));
    
    this.AddParam("type", enumT, "valid");
    this.AddParam("num", "number", "packets numbers");
    this.AddParam("mid", "number", "message id");
    this.AddParam("errorcode", enumE, "errorcode");
    
    this.AddWriteSendParam({type:null});
    
    this.AddWriteAnswerParam({type:4, num:null, mid:null});
    this.AddWriteAnswerParam({type:null});
    
    this.AddExeAnswerParam({errorcode:null, mid:null});
    
  }
  
  HoldUp(str)
  {
    if(this.GetRequestType() == "exe")
    {
      const regex = /CCOAPRECV:|CCOAPACTION: [1-9]/gm;
      let m;
      let stringIncomplete = true;
      while ((m = regex.exec(str)) !== null) {
        m.forEach((match, groupIndex) => {
          stringIncomplete = false;
        });
      }
      console.log("String incomplete", stringIncomplete);
      return stringIncomplete;
    }
    return false;
  }
  
  Parse(str)
  {
    super.Parse(str);
        
    this.GetLines().forEach(l=>{
      if(this.value == "") this.value = l;
      if(l.trim().length > 4)
      {
        const values = l.substring(this.GetCmd().length-1).trim().split(",");
        
        if(this.GetRequestType() == "exe")
        {
          if(values.length >= 2)
          {
           if(l.startsWith("+CCOAPRECV:") && values.length >= 3)
            {
              this.#packSize = parseInt(values[1].trim());
              this.#payloadSize = parseInt(values[2].trim());
            }
          }
        }
      }
    });
    return this.value;
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    this.GetLines().forEach(l=>{
      if(l.trim().length > 1)
      {
        const p = this.GetParams(false);
        _CN("span", {}, [l], div);

        const values = l.substring(this.GetCmd().length-1).trim().split(",");
        if(values.length >= 2)
        {
          _CN("span", {}, ["mid: " + this.GetMid()], div);
          if(this.GetRequestType() == "exe" && l.startsWith("+CCOAPRECV:"))
          {
            _CN("span", {}, ["pack size: " + this.#packSize], div);
            _CN("span", {}, ["payload size: " + this.#payloadSize], div);
          }
        }
      }
    });
  }
  
  GetMid()
  {
    const value = this.GetValue();
    return value.mid;
  }
  
};