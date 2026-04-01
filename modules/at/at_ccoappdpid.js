let AT_CCOAPPDPID = new class extends ATBase
{  
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true, 
      read: true,
      test: true,
      description: "Select PDP Index for CoAP",
      example: "+CCOAPPDPID:4",
      cmd: "AT+CCOAPPDPID",
      doc: "18.2.1"
    });
    
    let enumI = [];
    enumI.push(new ATEnum(0, "Index 0 (manual)"));
    enumI.push(new ATEnum(1, "Index 1 (manual)"));
    enumI.push(new ATEnum(2, "Index 2 (manual)"));
    enumI.push(new ATEnum(3, "Index 3 (manual)"));
    enumI.push(new ATEnum(4, "Auto select"));
    
    this.AddParam("index", enumI, "PDP index");
    
    this.AddWriteSendParam({index:null});
        
    this.AddReadAnswerParam({errorcode:null, mid:null});
  }
  
  
  ShowChat(div)
  {
    super.ShowChat(div);
  }

};
