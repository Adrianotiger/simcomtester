let AT_SHAHEAD = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Add Head",
      example: "+SHAHEAD: 0,0",
      cmd: "AT+SHAHEAD",
      doc: "13.2.5"
    });
    
    this.AddParam("type", "string", "type");
    this.AddParam("value", "string", "value");
    
    this.AddReadAnswerParam({type:null, value:null});
    
    this.AddWriteSendParam({type:null, value:null});
    
  }
};