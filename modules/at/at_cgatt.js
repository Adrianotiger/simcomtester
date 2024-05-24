let AT_CGATT = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Attach or Detach from GPRS Service",
      example: "+CGATT: 0",
      cmd: "AT+CGATT",
      timeout: 75000
    }); //true, true, false, true, "Attach or Detach from GPRS Service", "+CGATT: 0", "AT+CGATT", 75000);
    
    let enumS = [];
    enumS.push(new ATEnum(0, "Detached"));
    enumS.push(new ATEnum(1, "Attached"));
    this.AddParam("n", enumS, "network");
    
    this.AddReadAnswerParam({n:null});
    this.AddWriteSendParam({n:null});
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    const value = this.GetValue();
    
    if(this.GetRequestType() == "read")
    {  
      let p = this.GetParam("n");
      _CN("span", {}, [p.GetValue(value.n).GetDescription()], div);
    }
  }
    
  IsAttached()
  {
    const value = this.GetValue();

    return value.n == 1;
  }
  
  Attach()
  {
    return this.Write([1]);
  }
  Detach()
  {
    return this.Write([0]);
  }
};