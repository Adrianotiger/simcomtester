let AT_CNACT = new class extends ATBase
{
    // Active Networks (up to 4 can be active)
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
      this.#acts.push({active:false, ip:""});
    }
  }
  
  Parse(str)
  {
    super.Parse(str);
    
    if(str.split(",").length > 2)
    {
      let v = this.GetValue();
      this.#acts[parseInt(v.pdpidx)].active = (parseInt(v.statusx) == 1);
      this.#acts[parseInt(v.pdpidx)].ip = this.#acts[parseInt(v.pdpidx)].active ? v.addressx : "";
    }
  }
    
  IsActive(index)
  {
    return this.#acts[index].active;
  }
  
  GetIp(index)
  {
    return this.IsActive(index) ? this.#acts[index].ip : "";
  }
};