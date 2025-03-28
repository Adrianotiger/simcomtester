let AT_CGPADDR = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      write:true,
      description: "Show PDP Address",
      example: "+GPADDR: 1,128.191.1.2",
      cmd: "AT+CGPADDR",
      doc: "6.2.4"
    });

    this.AddParam("cid", "number", "PDP context");
    this.AddParam("PDP_addr", "string", "PDP IP Address");
    
    this.AddWriteSendParam({cid:null});
    this.AddExeAnswerParam({cid:null, PDP_addr:null});
  }
};