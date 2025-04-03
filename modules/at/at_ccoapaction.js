let AT_CCOAPACTION = new class extends ATBase
{
  #packSize = 0;
  #payloadSize = 0;
  #coapReceived = false;
  
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true, 
      exe: true,
      test: true,
      description: "Operate CoAP Object",
      example: "+CCOAPACTION: 0,1",
      cmd: "AT+CCOAPACTION",
      doc: "18.2.6"
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

  Execute()
  {
    this.#coapReceived = false;
    this.#packSize = -1;
    this.#payloadSize = -1;
    
    return super.Execute();
  }
  
  HoldUp(str)
  {
    if(this.GetRequestType() == "exe")
    {
      return !this.#coapReceived;
    }
    return false;
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    this.GetLines().forEach(l=>{
      if(l.trim().length > 1)
      {
        //const p = this.GetParams(false);
        //_CN("span", {}, [l], div);

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

  ShowChatDetail(div)
  {    
    _CN("span", {}, ["mid: " + this.GetMid()], div);
    _CN("span", {}, ["pack size: " + this.#packSize], div);
    _CN("span", {}, ["payload size: " + this.#payloadSize], div);
  }
  
  GetMid()
  {
    const value = this.GetValue();
    return value.mid;
  }

  SetPackSize(pack, payload)
  {
    this.#packSize = pack;
    this.#payloadSize = payload;
    this.#coapReceived = true;
  }

  IsCoapReceived()
  {
    return this.#coapReceived;
  }
};

 
let _CCOAPRECV = new class extends ATBase
{
  constructor()
  {
    super({
      description: "COAPACTION Response",
      example: "+CCOAPRECV: 0,120,115",
      cmd: "+CCOAPRECV", 
      doc: "18.2.6"
    });
    
    this.AddParam("mid", "number", "message id");
    this.AddParam("packsize", "number", "packet size");
    this.AddParam("payloadsize", "number", "payload size");
    
    this.AddUnsolicitedAnswerParam({mid:null, packsize:null, payloadsize:null});
  }

  Parse(str)
  {
    super.Parse(str);

    const v = this.GetValue();
    AT_CCOAPACTION.SetPackSize(v.packsize, v.payloadsize);

    // As this is not a normal command, emulate the OK
    super.Parse("OK");
  }

  ShowChat(div)
  {
    super.ShowChat(div);

    AT_CCOAPACTION.ShowChatDetail(div);
  }
};