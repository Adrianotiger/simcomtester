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
      description: "QUALCOMM Report (see AT+CURCCFG)",
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
};

let _QCSRVCINFO = new class extends ATBase
{
  constructor()
  {
    super({
      description: "QUALCOMM Report (see AT+CURCCFG)",
      example: "QCSRVCINFO : 7,1",
      cmd: "QCSRVCINFO",
      doc: "5.2.49"
    });
    
    let enumRat = [];
    enumRat.push(new ATEnum(0, "GSM"));
    enumRat.push(new ATEnum(7, "CAT-M"));
    enumRat.push(new ATEnum(9, "NB-IOT"));
    this.AddParam("rat_type", enumRat, "radio access technology");

    let enumService = [];
    enumService.push(new ATEnum(0, "Not register network"));
    enumService.push(new ATEnum(1, "Register network"));
    this.AddParam("service_status", enumService, "network status");

    this.AddUnsolicitedAnswerParam({rat_type:null, service_status:null});
  }
};

let _QCJDSTATE = new class extends ATBase
{
  constructor()
  {
    super({
      description: "QUALCOMM Report (see AT+CURCCFG)",
      example: "$QCJDSTATE : 9,1 0",
      cmd: "$QCJDSTATE",
      doc: "5.2.49"
    });
    
    let enumRat = [];
    enumRat.push(new ATEnum(0, "GSM"));
    enumRat.push(new ATEnum(7, "CAT-M"));
    enumRat.push(new ATEnum(9, "NB-IOT"));
    this.AddParam("rat_type", enumRat, "radio access technology");

    let enumJam = [];
    enumJam.push(new ATEnum("0 0", "Not Jamming"));
    enumJam.push(new ATEnum("0 1", "Soft Jamming"));
    enumJam.push(new ATEnum("1 0", "Jamming"));
    enumJam.push(new ATEnum("1 1", "Jamming"));
    enumJam.push(new ATEnum("2 0", "Unknown"));
    enumJam.push(new ATEnum("2 1", "Unknown Jamming"));
    this.AddParam("jamming_status", enumJam, "jamming status");

    this.AddUnsolicitedAnswerParam({rat_type:null, jamming_status:null});
  }
};


let _RDY = new class extends ATBase
{
  constructor()
  {
    super({
      description: "SYS Report (see AT+CURCCFG)",
      example: "RDY",
      cmd: "RDY",
      doc: "5.2.49"
    });
  }
};

let _CFUN = new class extends ATBase
{
  constructor()
  {
    super({
      description: "SYS Report (see AT+CURCCFG)",
      example: "+CFUN: 1",
      cmd: "+CFUN",
      doc: "5.2.49"
    });
    
    let enumFun = [];
    enumFun.push(new ATEnum(0, "Minimum functionality"));
    enumFun.push(new ATEnum(1, "Full functionality (Default)"));
    enumFun.push(new ATEnum(4, "Disable phone RF"));
    enumFun.push(new ATEnum(5, "Factory Test Mode"));
    enumFun.push(new ATEnum(6, "Reset"));
    enumFun.push(new ATEnum(7, "Offline Mode"));
    this.AddParam("fun", enumFun, "functionality");

    this.AddUnsolicitedAnswerParam({fun:null});
  }
};

/* _CPIN is already set on AT+CPIN */

let _SMSREADY = new class extends ATBase
{
  constructor()
  {
    super({
      description: "SMS Report (see AT+CURCCFG)",
      example: "SMS Ready",
      cmd: "SMS Ready",
      doc: "5.2.49"
    });
  }
};
