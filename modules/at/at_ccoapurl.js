let AT_CCOAPURL = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true,
      test: true,
      description: "Configure CoAP URL",
      cmd: "AT+CCOAPURL",
      doc: "18.2.4"
    }); //false, true, false, true, "Configure CoAP URL", "", "AT+CCOAPURL", 1000);
    
    this.AddParam("url", "string", "scheme://host:port/uri");
    
    this.AddWriteSendParam({url:null});
  }
};