let AT_CCOAPPARA = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true,
      test: true,
      description: "Assembling CoAP Data Packet",
      cmd: "AT+CCOAPPARA"
    }); //false, true, false, true, "Assembling CoAP Data Packet", "", "AT+CCOAPPARA", 1000);
    
    let enumC = [];
    enumC.push(new ATEnum(0, "EMPTY"));
    enumC.push(new ATEnum(1, "GET"));
    enumC.push(new ATEnum(2, "POST"));
    enumC.push(new ATEnum(3, "PUT"));
    enumC.push(new ATEnum(4, "DELETE"));
    enumC.push(new ATEnum(5, "FETCH"));
    enumC.push(new ATEnum(6, "PATCH"));
    enumC.push(new ATEnum(7, "iPATCH"));
    
    this.AddParam("code", enumC, "code");
    this.AddParam("uripath", "string", "uri path");
    this.AddParam("uriquery", "string", "uri query");
    this.AddParam("payload", "string", "payload");
    
    for(var j=0;j<30;j++)
    {
      this.AddParam("param" + j, "string", "code");
    }
    
    for(var j=2;j<30;j++)
    {
      let obj = {};
      for(var k=0;k<j;k++)
      {
        obj["param" + k] = null;
      }
      this.AddWriteSendParam(obj);
    }
  }
};