let AT_CGDCONT = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      test: true,
      read: true,
      description: "Define PDP Context",
      example: "+CGDCONT: 1,\"IPV4V6\",\"\",\"\",0,0,0",
      cmd: "AT+CGDCONT",
      doc: "6.2.2"
    });

    let enumPdp = [];
    enumPdp.push(new ATEnum("IP", "Internet Protocol"));
    enumPdp.push(new ATEnum("IPV6", "Internet Protocol Version 6"));
    enumPdp.push(new ATEnum("IPV4V6", "Dual PDN Stack"));
    enumPdp.push(new ATEnum("Non-IP", "Transfer of Non-IP data"));

    let enumDComp = [];
    enumDComp.push(new ATEnum(0, "Off"));
    enumDComp.push(new ATEnum(1, "On"));
    enumDComp.push(new ATEnum(2, "V.42bis"));

    let enumHComp = [];
    enumHComp.push(new ATEnum(0, "Off"));
    enumHComp.push(new ATEnum(1, "On"));
    enumHComp.push(new ATEnum(2, "RFC1144"));
    enumHComp.push(new ATEnum(3, "RFC2507"));
    enumHComp.push(new ATEnum(4, "RFC3095"));

    let enumIP = [];
    enumIP.push(new ATEnum(0, "NAS Signaling"));
    enumIP.push(new ATEnum(1, "Off"));

    let enumEFlag = [];
    enumEFlag.push(new ATEnum(0, "Off"));
    enumEFlag.push(new ATEnum(1, "On"));
    
    this.AddParam("cid", "number", "PDP Context Identifier");
    this.AddParam("pdp_type", enumPdp, "PDP_type");
    this.AddParam("apn", "string", "network apn");
    this.AddParam("pdp_addr", "string", "PDP Address");
    this.AddParam("d_comp", enumDComp, "Data compression");
    this.AddParam("h_comp", enumHComp, "Head compression");
    this.AddParam("ipv4_ctrl", enumIP, "ipv4 information");
    this.AddParam("emergency_flag", enumEFlag, "emergency flag");

    this.AddReadAnswerParam({cid:null, pdp_type:null, apn:null, pdp_addr:null, d_comp:null, h_comp:null, ipv4_ctrl:null});
    this.AddReadAnswerParam({cid:null, pdp_type:null, apn:null, pdp_addr:null, d_comp:null, h_comp:null, ipv4_ctrl:null, emergency_flag:null});
  }
};
