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

let _QCIMGBOOTTYPE = new class extends ATBase
{
  constructor()
  {
    super({
      description: "URC Report for QUALCOMM",
      example: "QCIMGBOOTTYPE : 1",
      cmd: "QCIMGBOOTTYPE",
      doc: "5.2.49"
    });
    
    let enumBoot = [];
    enumBoot.push(new ATEnum(1, "Modem full image boot"));
    enumBoot.push(new ATEnum(2, "Modem page-only image boot"));
    this.AddParam("img_boot_type", enumBoot, "boot type");

    this.AddUnsolicitedAnswerParam({img_boot_type:null});
  }

  Parse(str)
  {
    super.Parse(str);

    //const v = this.GetValue();
    //AT_CCOAPACTION.SetPackSize(v.packsize, v.payloadsize);

    // As this is not a normal command, emulate the OK
    super.Parse("OK");
  }
};
