let AT_SHSTATE = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      description: "Query HTTP(S) Connection Status",
      example: "+SHSTATE: 0",
      cmd: "AT+SHSTATE"
    });
    
    let enumS = [];
    enumS.push(new ATEnum(0, "Expression HTTP(S) disconnect state"));
    enumS.push(new ATEnum(1, "Expression HTTP(S) connect state"));
    
    this.AddParam("status", enumS, "status");
    
    this.AddReadAnswerParam({status:null});
  }
  
  IsConnected()
  {
    const value = this.GetValue();
    
    return (parseInt(value.status) == 1);
  }
};