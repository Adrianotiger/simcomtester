let AT_CCOAPCFG = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true,
      test: true,
      description: "Select CoAP Configure",
      cmd: "AT+CCOAPCFG",
      doc: "18.2.3"
    }); 
    
    this.AddParam("param", "string", "Parameter");
    this.AddParam("index", "number", "SSL Status");
    this.AddParam("ca_list", "string", "List file name (max 50 bytes)");
    this.AddParam("cert_name", "string", "Cert file name (max 50 bytes)");
    this.AddParam("psktable", "string", "PSK table name (max 50 bytes)");
    
    this.AddWriteSendParam({param:"SSL", index:null, ca_list:null, cert_name:null, psktable:null});
  }
};