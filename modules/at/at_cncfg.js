let AT_CNCFG = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "PDP Config",
      example: "+CNCFG: 0,0,\"\",\"\",\"\",0",
      cmd: "AT+CNCFG"
    }); //true, true, false, true, "PDP Config", "+CNCFG: 0,0,\"\",\"\",\"\",0", "AT+CNCFG", 1000);
    
    let enumIdx = [];
    enumIdx.push(new ATEnum(0, "pdpidx 0"));
    enumIdx.push(new ATEnum(1, "pdpidx 1"));
    enumIdx.push(new ATEnum(2, "pdpidx 2"));
    enumIdx.push(new ATEnum(3, "pdpidx 3"));
        
    let enumIp = [];
    enumIp.push(new ATEnum(0, "Dual PDN Stack"));
    enumIp.push(new ATEnum(1, "Internet Protocol Version 4"));
    enumIp.push(new ATEnum(2, "Internet Protocol Version 6"));
    enumIp.push(new ATEnum(3, "NONIP"));
    enumIp.push(new ATEnum(4, "EX_NONIP"));
        
    let enumA = [];
    enumA.push(new ATEnum(0, "NONE"));
    enumA.push(new ATEnum(1, "PAP"));
    enumA.push(new ATEnum(2, "CHAP"));
    enumA.push(new ATEnum(3, "PAP or CHAP"));
    
    this.AddParam("pdpidx", enumIdx, "pdpidx");
    this.AddParam("iptype", enumIp, "ip_type");
    this.AddParam("apn", "string", "APN");
    this.AddParam("username", "string", "Username");
    this.AddParam("password", "string", "Password");
    this.AddParam("authentication", enumA, "Authentication");
    
    this.AddReadAnswerParam({pdpidx:null, iptype:null, apn:null, username:null, password:null, authentication:null});
    this.AddWriteSendParam({pdpidx:null, iptype:null});
    this.AddWriteSendParam({pdpidx:null, iptype:null, apn:null});
    this.AddWriteSendParam({pdpidx:null, iptype:null, apn:null, username:null, password:null});
    this.AddWriteSendParam({pdpidx:null, iptype:null, apn:null, username:null, password:null, authentication:null});
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    const value = this.GetValue();
        
    if(this.GetRequestType() == "exe")
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
};