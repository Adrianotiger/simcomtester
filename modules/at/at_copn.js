let AT_COPN = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "Read Operator Names",
      example: "+COPN: 40000,Test Operator",
      cmd: "AT+COPN",
      timeout: 1000,
      doc: "3.2.18"
    }); 
    
    this.AddParam("numeric", "number", "Operator numeric code");
    this.AddParam("alpha", "string", "Operator long alphanumeric");
    
    this.AddExeAnswerParam({numeric:null, alpha:null});
  }
    
};