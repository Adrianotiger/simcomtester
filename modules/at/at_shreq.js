let AT_SHREQ = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Set Request Type",
      example: "+SHREQ: ,0",
      cmd: "AT+SHREQ",
      doc: "13.2.10"
    });
    
    let enumT = [];
    enumT.push(new ATEnum(1, "GET"));
    enumT.push(new ATEnum(2, "PUT"));
    enumT.push(new ATEnum(3, "POST"));
    enumT.push(new ATEnum(4, "PATCH"));
    enumT.push(new ATEnum(5, "HEAD"));
    
    this.AddParam("type", enumT, "type");
    this.AddParam("url", "string", "url");
    this.AddParam("value", "string", "value");
    this.AddParam("typestring", "string", "type");
    this.AddParam("statuscode", "number", "status code");
    this.AddParam("datalen", "number", "data length");
    
    this.AddReadAnswerParam({url:null, type:null});
    
    this.AddWriteSendParam({url:null, type:null});
    
    this.AddWriteAnswerParam({typestring:null, statuscode:null, datalen:null});
    
  }
  
  HoldUp(str)
  {
    if(str.indexOf("+SHREQ:") < 0) return true;
    return false;
  }
  
  GetStatusCode()
  {
    const value = this.GetValue();
    return parseInt(value.statuscode);
  }
  
  GetDataLength()
  {
    const value = this.GetValue();
    return parseInt(value.datalen);
  }
};