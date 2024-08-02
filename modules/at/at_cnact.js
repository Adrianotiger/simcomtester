let AT_CNACT = new class extends ATBase
{
  #acts = [];
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "APP Network Active",
      example: "+CNACT: 0,0,\"0.0.0.0\"",
      cmd: "AT+CNACT",
      doc: "7.2.1"
    }); //true, true, false, true, "APP Network Active", "+CNACT: 0,0,\"0.0.0.0\"", "AT+CNACT", 1000);
    
    let enumIdx = [];
    enumIdx.push(new ATEnum(0, "pdpidx 0"));
    enumIdx.push(new ATEnum(1, "pdpidx 1"));
    enumIdx.push(new ATEnum(2, "pdpidx 2"));
    enumIdx.push(new ATEnum(3, "pdpidx 3"));
    
    let enumSX = [];
    enumSX.push(new ATEnum(0, "Deactived"));
    enumSX.push(new ATEnum(1, "Actived"));
    enumSX.push(new ATEnum(2, "In operation"));
        
    let enumA = [];
    enumA.push(new ATEnum(0, "Deactive"));
    enumA.push(new ATEnum(1, "Active"));
    enumA.push(new ATEnum(2, "Auto Active"));
    
    this.AddParam("pdpidx", enumIdx, "pdpidx");
    this.AddParam("statusx", enumSX, "status X");
    this.AddParam("action", enumA, "action");
    this.AddParam("addressx", "string", "adress X");
    this.AddParam("ipv6address", "string", "IPv6 address");
    
    this.AddReadAnswerParam({pdpidx:null, statusx:null, addressx:null});
    this.AddReadAnswerParam({pdpidx:null, statusx:null, addressx:null, ipv6address:null});
    
    this.AddWriteSendParam({pdpidx:null, action:null});
        
    for(var j=0;j<4;j++)
    {
      this.#acts.push({active:0, ip:""});
    }
  }
  
  Parse(str)
  {
    let value = super.Parse(str);
    
    let index = 0;
    this.GetLines().forEach(l=>{
      if(l.indexOf("+CNACT:") === 0)
      {
        if(this.GetRequestType() == "read")
        {
          const values = l.substring(this.GetCmd().length-1).trim().split(",");
          if(values.length >= 3)
          {
            this.#acts[index].active = parseInt(values[1]);
            this.#acts[index].ip = values[2].replace(/\"/g, "").trim();
          }
        }
        index++;
      }
    });
    return value;
  }
    
  IsActive(index)
  {
    return this.#acts[index].active;
  }
  
  GetIp(index)
  {
    return this.#acts[index].ip;
  }
};