let AT_CASEND = new class extends ATBase
{  
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      test: true,
      write: true,
      description: "Send Data via TCP/UDP Connection",
      example: "AT+CASEND=0,5",
      cmd: "AT+CASEND",
      doc: "12.2.5",
      timeout: 5000
    });
    
    let enumId = [];
    for(var j=0;j<=12;j++)
      enumId.push(new ATEnum(j, "CID #" + j));
    
    this.AddParam("cid", enumId, "Command identifier");
    this.AddParam("datalen", "number", "Data length");
    this.AddParam("inputtime", "number", "Input timeout");

    this.AddWriteSendParam({cid:null, datalen:null});
    this.AddWriteSendParam({cid:null, datalen:null, inputtime:null});
  }
  
  HoldUp(str)
  {
    if(str.trim().length < 2) return true;
    return false;
  }

  Parse(str)
  {
    console.log("CASEND: ", str);
    super.Parse(str);

  }
};