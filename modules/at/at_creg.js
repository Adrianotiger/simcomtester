let AT_CREG = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true, 
      write: true,
      test: true,
      description: "Network Registration",
      example: "+CREG: 0,2",
      cmd: "AT+CREG"
    }); //true, true, false, true, "Network Registration", "+CREG: 0,2", "AT+CREG", 1000);
    
    let enumN = [];
    enumN.push(new ATEnum(0, "Disable network registration unsolicited result"));
    enumN.push(new ATEnum(1, "Enable network registration unsolicited result"));
    enumN.push(new ATEnum(2, "Enable network registration unsolicited result code with location information"));
    
    let enumStat = [];
    enumStat.push(new ATEnum(0, "Not registered, MT is not currently searching a new operator to register to"));
    enumStat.push(new ATEnum(1, "Registered, home network"));
    enumStat.push(new ATEnum(2, "Not registered, but MT is currently searching a new operator to register to"));
    enumStat.push(new ATEnum(3, "Registration denied"));
    enumStat.push(new ATEnum(4, "Unknown"));
    enumStat.push(new ATEnum(5, "Registered, roaming"));
        
    let enumNetAct = [];
    enumNetAct.push(new ATEnum(0, "User-specified GSM access technology"));
    enumNetAct.push(new ATEnum(1, "GSM compact"));
    enumNetAct.push(new ATEnum(3, "GSM EGPRS"));
    enumNetAct.push(new ATEnum(7, "User-specified LTE M1 A GB access technology"));
    enumNetAct.push(new ATEnum(9, "User-specified LTE NB S1 access technology"));
    
    this.AddParam("n", enumN, "network");
    this.AddParam("stat", enumStat, "state");
    this.AddParam("lac", "string", "two byte location area code in hexadecimal format");
    this.AddParam("ci", "string", "two byte cell ID in hexadecimal form");
    this.AddParam("netact", enumNetAct, "Network Activity");
    
    this.AddTestAnswerParam({n:null});
    
    this.AddReadAnswerParam({n:null, stat:null});
    this.AddReadAnswerParam({n:2, stat:null, lac:null, ci:null, netact:null});
    
    this.AddWriteSendParam({n:null});
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    const value = this.GetValue();
    
    if(this.GetRequestType() == "read")
    {      
      _CN("span", {}, [this.GetParam("n").GetValue(value.n)?.GetDescription()], div);
      _CN("span", {}, [this.GetParam("stat").GetValue(value.stat)?.GetDescription()], div);
    }
  }
};