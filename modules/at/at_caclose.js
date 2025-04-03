let AT_CACLOSE = new class extends ATBase
{  
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      test: true,
      write: true,
      description: "Close TCP/UDP Connection",
      example: "AT+CACLOSE=1",
      cmd: "AT+CACLOSE",
      doc: "12.2.9"
    });
    
    let enumId = [];
    for(var j=0;j<=12;j++)
      enumId.push(new ATEnum(j, "CID #" + j));
    
    this.AddParam("cid", enumId, "Command identifier");

    this.AddWriteSendParam({cid:null});
  }
  
};