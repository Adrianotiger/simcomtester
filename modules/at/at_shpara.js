let AT_SHPARA = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Set HTTP(S) Parameter",
      example: "+SHPARA: 64,64",
      cmd: "AT+SHPARA",
      doc: "13.2.6"
    });
    
    this.AddParam("key", "string", "key");
    this.AddParam("value", "string", "value");
    
    this.AddReadAnswerParam({key:null, value:null});
    
    this.AddWriteSendParam({key:null, value:null});
    
  }
};