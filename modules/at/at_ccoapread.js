let AT_CCOAPREAD = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true, 
      test: true,
      description: "Read Data of CoAP Packet",
      example: "+CCOAPREAD:5,Test",
      cmd: "AT+CCOAPREAD",
      doc: "18.2.8"
    });
    
    
    this.AddParam("mid", "number", "message ID");
    this.AddParam("length", "number", "Packet length");
    this.AddParam("data", "string", "Data of packet");
    
    
    this.AddTestAnswerParam({mid:null});
    
    this.AddWriteSendParam({mid:null});
    this.AddWriteAnswerParam({length:null, data:null});
  }
  
  Parse(str)
  {
    super.Parse(str);
    
    return this.value;
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
  }
};