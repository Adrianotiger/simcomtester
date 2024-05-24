let AT_CMEE = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Report Mobile Equipment Error",
      example: "+CMEE: 0",
      cmd: "AT+CMEE"
    }); //true, true, false, true, "Report Mobile Equipment Error", "+CMEE: 0", "AT+CMEE", 1000);
    
    let enumC = [];
    enumC.push(new ATEnum(0, "Disable"));
    enumC.push(new ATEnum(1, "Enable with numeric error code"));
    enumC.push(new ATEnum(2, "Enable with verbose error message"));
    this.AddParam("n", enumC, "error message");
    
    this.AddReadAnswerParam({n:null});
    this.AddWriteSendParam({n:null});
  }
};