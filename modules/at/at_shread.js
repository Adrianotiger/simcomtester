let AT_SHREAD = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true,
      test: true,
      description: "Read Response Value",
      example: "+SHREAD: (0-307200),(1-307200)",
      cmd: "AT+SHREAD"
    });
    
    this.AddParam("startaddress", "number", "start address");
    this.AddParam("datalen", "number", "data length");
    
    
    this.AddWriteSendParam({startaddress:null, datalen:null});
    
    this.AddWriteAnswerParam({datalen:null});
  }
  
  HoldUp(str)
  {
    if(str.indexOf("ERROR") >= 0 && str.indexOf("ERROR") < 10) return false;
    
    if(str.indexOf("OK") < 0) return true;
    if(str.indexOf("+SHREAD:") < 0) return true;
    
    const pos0 = str.indexOf("+SHREAD:") + 1;
    let pos1 = pos0;
    for(var j=pos0;j<str.length;j++)
    {
      if(!Number.isInteger(str[j]))
      {
        pos1 = j; 
        break;
      }
    }
    const datalen = parseInt(str.substring(pos0, pos1-pos0));
    if(str.length - pos1 < datalen) return false;
    return false;
  }
};