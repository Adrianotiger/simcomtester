let AT_COPS = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Operator Selection",
      example: "+COPS:0,0,\"CHINA MOBILE\"",
      cmd: "AT+COPS",
      timeout: 120000
    }); //true, true, false, true, "Operator Selection", "+COPS:0,0,\"CHINA MOBILE\"", "AT+COPS", 120000);
    
    let enumM = [];
    enumM.push(new ATEnum(0, "Automatic mode"));
    enumM.push(new ATEnum(1, "Manual"));
    enumM.push(new ATEnum(2, "Manual deregister from network"));
    enumM.push(new ATEnum(3, "Set only"));
    enumM.push(new ATEnum(4, "Manual/automatic"));
    
    let enumF = [];
    enumF.push(new ATEnum(0, "Long format alphanumeric"));
    enumF.push(new ATEnum(1, "Short format alphanumeric"));
    enumF.push(new ATEnum(2, "Numeric"));
    
    let enumN = [];
    enumN.push(new ATEnum(0, "User-specified GSM"));
    enumN.push(new ATEnum(1, "GSM compact"));
    enumN.push(new ATEnum(3, "GSM EGPRS"));
    enumN.push(new ATEnum(7, "User-specified LTE M1 A GB"));
    enumN.push(new ATEnum(9, "User-specified LTE NB S1"));
    
    this.AddParam("mode", enumM, "mode");
    this.AddParam("format", enumF, "format");
    this.AddParam("oper", "string", "operator");
    this.AddParam("netact", enumN, "net access activity");
    
    this.AddReadAnswerParam({mode:null});
    this.AddReadAnswerParam({mode:null, format:null, oper:null, netact:null});
    
    this.AddWriteSendParam({mode:null});
    this.AddWriteSendParam({mode:null, format:null, oper:null});
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    const value = this.GetValue();
        
    if(this.GetRequestType() == "read")
    {
      Object.keys(value).forEach(k=>{
        const p = this.GetParam(k);
        if(p.GetValue(value[k]) != null)
        {
          _CN("span", {}, [p.GetValue(value[k])?.GetDescription()], div);
        }
        else
        {
          _CN("span", {}, [k + ": " + value[k]], div);
        }
      });
    }
  }
  
  GetOperator()
  {
    const value = this.GetValue();
    return value.oper;
  }
  
};