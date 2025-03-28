let AT_CGREG = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      test: true,
      read: true,
      write: true,
      description: "Network Registration Status",
      example: "+CGREG: 0,2",
      cmd: "AT+CGREG",
      doc: "6.2.5"
    });

    let enumN = [];
    enumN.push(new ATEnum(0, "Disable network registration unsolicited"));
    enumN.push(new ATEnum(1, "Enable network registration unsolicited"));
    enumN.push(new ATEnum(2, "Enable network registration and location unsolicited"));
    enumN.push(new ATEnum(4, "Enable display GPRS time"));

    let enumStat = [];
    enumStat.push(new ATEnum(0, "Not registered, not searching"));
    enumStat.push(new ATEnum(1, "Registered, Home network"));
    enumStat.push(new ATEnum(2, "Not registered, searching"));
    enumStat.push(new ATEnum(3, "Registration denied"));
    enumStat.push(new ATEnum(4, "Unknown"));
    enumStat.push(new ATEnum(5, "Registered, roaming"));
    enumStat.push(new ATEnum(6, "Reserved"));

    let enumNet = [];
    enumNet.push(new ATEnum(0, "GSM user"));
    enumNet.push(new ATEnum(1, "GSM compact"));
    enumNet.push(new ATEnum(3, "GSM egprs"));
    enumNet.push(new ATEnum(7, "LTE M1"));
    enumNet.push(new ATEnum(9, "LTE NB"));

    let enumIP = [];
    enumIP.push(new ATEnum(0, "NAS Signaling"));
    enumIP.push(new ATEnum(1, "Off"));

    let enumEFlag = [];
    enumEFlag.push(new ATEnum(0, "Off"));
    enumEFlag.push(new ATEnum(1, "On"));
    
    this.AddParam("n", enumN, "network registration");
    this.AddParam("stat", enumStat, "network state");
    this.AddParam("lac", "string", "location area");
    this.AddParam("ci", "string", "cell id");
    this.AddParam("netact", enumNet, "network access");
    this.AddParam("rac", "string", "routing area code");

    this.AddWriteSendParam({n:null});

    this.AddReadAnswerParam({n:null, stat:null});
    this.AddReadAnswerParam({n:null, stat:null, lac:null, ci:null, netact:null, rac:null});
  }
};