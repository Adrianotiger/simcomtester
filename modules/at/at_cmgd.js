let AT_CMGD = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true,
      test: true,
      description: "Delete SMS Message",
      example: "+CMGD: (0,1,2),(0-4)",
      cmd: "AT+CMGD",
      timeout: 25000
    });// true, true, false, true, "Enter/Read PIN", "+CPIN: READY", "AT+CPIN", 5000);
    
    let enumD = [];
    enumD.push(new ATEnum(0, "Delete message specified in index"));
    enumD.push(new ATEnum(1, "Delete all read messages from preferred messages"));
    enumD.push(new ATEnum(2, "Delete all read messages from preferred message storage and sent mobile originated messages"));
    enumD.push(new ATEnum(3, "Delete all read messages from preferred message storage, sent and unsent mobile originated message"));
    enumD.push(new ATEnum(4, "Delete all messages from preferred message storage"));
    
    this.AddParam("index", "number", "index");
    this.AddParam("delflag", enumD, "delflag");
            
    this.AddWriteSendParam({index:null});
    this.AddWriteSendParam({index:null, delflag:null});
  }
  
  
};