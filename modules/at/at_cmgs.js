let AT_CMGS = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true,
      test: true,
      description: "Send SMS Messages",
      example: "+CMGS: 213",
      cmd: "AT+CMGS",
      timeout: 60000
    });// true, true, false, true, "Enter/Read PIN", "+CPIN: READY", "AT+CPIN", 5000);
    
    this.AddParam("da", "string", "destination address");
    this.AddParam("toda", "number", "toda");
    
    this.AddParam("mr", "number", "message reference");
            
    this.AddWriteSendParam({da:null});
    this.AddWriteSendParam({da:null, toda:null});
    
    this.AddWriteAnswerParam({mr:null});
  }
  
  HoldUp(str)
  {
    if(str.trim().length < 2) return true;
    return false;
  }
};