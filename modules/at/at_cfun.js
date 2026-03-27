let AT_CFUN = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "SetPhoneFunctionality",
      example: "+CFUN:1",
      cmd: "AT+CFUN",
      timeout: 10000,
      doc: "3.2.19"
    });
    
    let enumF = [];
    enumF.push(new ATEnum(0, "Minimum functionality"));
    enumF.push(new ATEnum(1, "Full functionality (Default)"));
    enumF.push(new ATEnum(4, "Disable phone both transmit and receive RF circuits"));
    enumF.push(new ATEnum(5, "Factory Test Mode"));
    enumF.push(new ATEnum(6, "Reset"));
    enumF.push(new ATEnum(7, " Offline Mode"));
    this.AddParam("fun", enumF, "Functionality level");

    let enumR = [];
    enumR.push(new ATEnum(0, "Do not Reset the MT before setting it to <fun> power level"));
    enumR.push(new ATEnum(1, " Reset the MT before setting it to <fun> power level"));
    this.AddParam("rst", enumR, "Reset MT");
    
    this.AddReadAnswerParam({fun:null});
    this.AddWriteSendParam({fun:null});
    this.AddWriteSendParam({fun:null, rst:null});
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
  }
};