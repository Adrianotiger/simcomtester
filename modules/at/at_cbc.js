let AT_CBC = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Battery Charge",
      example: "+CBC: 0,62,3810",
      cmd: "AT+CBC",
      doc: "3.2.22"
    });// false, false, true, true, "Battery Charge", "+CBC: 0,62,3810", "AT+CBC", 1000);
    
    let enumBcs = [];
    enumBcs.push(new ATEnum(0, "ME is not charging"));
    enumBcs.push(new ATEnum(1, "ME is charging"));
    enumBcs.push(new ATEnum(2, "Charging has finished"));
    
    this.AddParam("bcs", enumBcs, "Charge status");
    this.AddParam("bcl", "number", "Battery connection level");
    this.AddParam("voltage", "number", "Battery voltage");
    
    this.AddExeAnswerParam({bcs:null, bcl:null, voltage:null});
  }
    
  ShowChat(div)
  {
    super.ShowChat(div);
    
    const value = this.GetValue();
    
    if(this.GetRequestType() == "exe")
    {
      _CN("span", {}, [this.GetParam("bcs").GetValue(value.bcs)?.GetDescription()], div);
      _CN("span", {}, [TabChat.DrawGauge(0,100,parseInt(value.bcl)), "charge: " + value.bcl + "%"], div);
      _CN("span", {}, ["voltage: " + value.voltage + "mV"], div);
    }
  }
  
  GetChargeStatus(asDescription)
  {
    const value = this.GetValue();
    return asDescription ? this.GetParam("bcs").GetValue(value.bcs).GetDescription() : this.GetParam("bcs").GetValue(value.bcs).GetValue();
  }
  
  GetCharge()
  {
    const value = this.GetValue();
    return value.bcl;
  }
  
  GetVoltage()
  {
    const value = this.GetValue();
    return value.voltage;
  }
};