let AT_CASTATE = new class extends ATBase
{  
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      description: "Query TCP/UDP State",
      example: "AT+CASTATE?",
      cmd: "AT+CASTATE",
      doc: "12.2.8"
    });
    
    let enumS = [];
    enumS.push(new ATEnum(0, "Closed"));
    enumS.push(new ATEnum(1, "Connected"));
    enumS.push(new ATEnum(1, "Listening"));
    
    
    let enumId = [];
    for(var j=0;j<=12;j++)
      enumId.push(new ATEnum(j, "CID #" + j));
    
    this.AddParam("cid", enumId, "Command identifier");
    this.AddParam("state", enumS, "ConnectionState");;

    this.AddReadAnswerParam({cid:null, state:null});
  }
  
};