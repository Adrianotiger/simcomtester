let AT_CURCCFG = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "URC Report Configuration",
      example: "+CURCCFG: \"QUALCOMM\",0",
      cmd: "AT+CURCCFG",
      doc: "5.2.49"
    }); 
    
    let enumUrc = [];
    enumUrc.push(new ATEnum("QUALCOMM", ""));
    enumUrc.push(new ATEnum("SYS", ""));
    enumUrc.push(new ATEnum("SIMCARD", ""));
    enumUrc.push(new ATEnum("SMS", ""));
    enumUrc.push(new ATEnum("NETWORK", ""));
    enumUrc.push(new ATEnum("TCPIP", ""));
    enumUrc.push(new ATEnum("NIDD", ""));
    this.AddParam("urc_type", enumUrc, "mode");

    let enumEn = [];
    enumEn.push(new ATEnum(0, "disabled"));
    enumEn.push(new ATEnum(1, "enabled"));
    this.AddParam("enable", enumEn, "enable");
    
    this.AddWriteSendParam({urc_type:null, enable:null});
    this.AddReadAnswerParam({urc_type:null, enable:null});
    
  }
};