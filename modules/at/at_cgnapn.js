let AT_CGNAPN = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Get Network APN in CAT-M or NB-IoT",
      example: "+CGNAPN: 0,\"\"",
      cmd: "AT+CGNAPN"
    }); //false, false, true, true, "Get Network APN in CAT-M or NB-IoT", "+CGNAPN: 0,\"\"", "AT+CGNAPN", 1000);
    
    let enumV = [];
    enumV.push(new ATEnum(0, "The network did not sent APN parameter to UE"));
    enumV.push(new ATEnum(1, "The network sent APN parameter to UE"));
    
    this.AddParam("valid", enumV, "valid");
    this.AddParam("apn", "string", "network apn");
    
    this.AddExeAnswerParam({valid:null, apn:null});
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
  
  GetApn()
  {
    const value = this.GetValue();
    return value.apn.replace(/\"/g,'');
  }
  
};