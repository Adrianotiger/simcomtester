let AT_CSQ = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Signal Quality Report",
      example: "+CSQ: 24,0",
      cmd: "AT+CSQ",
      doc: "3.2.16"
    }); //false, false, true, true, "Signal Quality Report", "+CSQ: 24,0", "AT+CSQ", 1000);
        
    this.AddParam("rssi", "number", "Radio Signal Strength");
    this.AddParam("ber", "number", "Bit Error Rate");
    
    this.AddExeAnswerParam({rssi:null, ber:null});
  }
  
  GetRSSI_dBm()
  {
    const value = this.GetValue();
    
    let dBm = -115;
    if(value.rssi == 1) dBm = -111;
    else if(value.rssi < 32) dBm = parseInt(-110 + parseInt((110-54) * (value.rssi - 2) / 28));
    else if(value.rssi == 99) dBm = -120;
    return dBm;
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    if(this.GetRequestType() != "exe") return;
    
    const value = this.GetValue();
    
    let strength = "unknown";
    if(value.rssi == 0) strength = "-115dBm (bad)";
    else if(value.rssi == 1) strength = "-111dBm (poor)";
    else if(value.rssi < 31) strength = (-110 + parseInt((110-54) * (value.rssi - 2) / 28)) + "dBm (" + (value.rssi < 15 ? "ok" : "good") + ")";
    else if(value.rssi == 31) strength = ">-52dBm (excellent)";
    else if(value.rssi == 99) strength = "-Unknown-";
    else strength = "Invalid - " + value.rssi;

    let ber = "-Unknown-";
    switch(value.ber)
    {
      case 0: ber = "<0.2%"; break;
      case 1: ber = "0.2%-0.4%"; break;
      case 2: ber = "0.4%-0.8%"; break;
      case 3: ber = "0.8%-1.6%"; break;
      case 4: ber = "1.6%-3.2%"; break;
      case 5: ber = "3.2%-6.4%"; break;
      case 6: ber = "6.4%-12.8%"; break;
      case 7: ber = ">12.8%"; break;
      case 99: "-Unknown-";
      default: ber = "INVALID"; break;
    }
    
    _CN("span", {}, ["rssi: " + strength], div);
    _CN("span", {}, ["ber: " + ber], div);
  }
};