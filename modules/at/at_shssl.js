let AT_SHSSL = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Select SSL Configure",
      example: "+SHSSL: 0,\"\",\"\"",
      cmd: "AT+SHSSL"
    });
    
    let enumI = [];
    enumI.push(new ATEnum(0, "index 0"));
    enumI.push(new ATEnum(1, "index 1"));
    enumI.push(new ATEnum(2, "index 2"));
    enumI.push(new ATEnum(3, "index 3"));
    enumI.push(new ATEnum(4, "index 4"));
    enumI.push(new ATEnum(5, "index 5"));
    
    this.AddParam("index", enumI, "configure index");
    this.AddParam("calist", "string", "ca list");
    this.AddParam("certname", "string", "cert name");
    this.AddParam("lencalist", "number", "ca list length");
    this.AddParam("lencertname", "number", "cert name length");
    
    this.AddWriteSendParam({index:null, calist:null});
    this.AddWriteSendParam({index:null, calist:null, certname:null});
    
    this.AddReadAnswerParam({index:null, calist:null, certname:null});

    this.AddTestAnswerParam({index:null, lencalist:null, lencertname:null});
  }
};