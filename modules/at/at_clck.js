let AT_CLCK = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true,
      test: true,
      description: "Facility Lock",
      example: "+CLCK: \"SC\",2",
      cmd: "AT+CLCK",
      doc: "3.2.7"
    });

    let enumFac = [];
    //enumFac.push(new ATEnum("AB", "All Barring services, mode=0"));
    //enumFac.push(new ATEnum("AC", "All incoming barring services, mode=0"));
    //enumFac.push(new ATEnum("AG", "All outgoing barring services, mode=0"));
    //enumFac.push(new ATEnum("AO", "BAOC (Barr All Outgoing Calls"));
    //enumFac.push(new ATEnum("IR", "BIC-Roam (Barr Inc.Calls on Roaming)"));
    //enumFac.push(new ATEnum("OI", "BOIC (Barr Out. International Calls)"));
    //enumFac.push(new ATEnum("OX", "BOIC-exHC (Barr Out. Int. Calls)"));
    enumFac.push(new ATEnum("SC", "SIM (lock SIM/UICC card) - PIN1"));
    enumFac.push(new ATEnum("FD", "SIM card or active application - PIN2"));
    enumFac.push(new ATEnum("PN", "Network Personalization - NCK"));
    enumFac.push(new ATEnum("PU", "Network subset Personalization - NSCK"));
    enumFac.push(new ATEnum("PP", "Service Provider Personalization - SPCK"));
    enumFac.push(new ATEnum("PF", "Lock Phone to the very First inserted SIM card"));

    let enumM = [];
    enumM.push(new ATEnum(0, "Unlock"));
    enumM.push(new ATEnum(1, "Lock"));
    enumM.push(new ATEnum(2, "Query Status"));

    let enumC = [];
    enumC.push(new ATEnum(1, "Voice (telephony)"));
    enumC.push(new ATEnum(2, "Data refers"));
    enumC.push(new ATEnum(4, "Fax (facsimile services)"));
    enumC.push(new ATEnum(7, "All classes"));

    let enumS = [];
    enumS.push(new ATEnum(0, "Inactive"));
    enumS.push(new ATEnum(1, "Active"));
    
    this.AddParam("fac", enumFac, "facility");
    this.AddParam("mode", enumM, "set mode");
    this.AddParam("passwd", "string", "Password");
    this.AddParam("class", enumC, "Class");
    this.AddParam("status", enumS, "Status");
    
    this.AddWriteSendParam({fac:null, mode:null});
    this.AddWriteSendParam({fac:null, mode:null, passwd:null});
    this.AddWriteSendParam({fac:null, mode:null, passwd:null, class:null});

    this.AddWriteAnswerParam({});
    this.AddWriteAnswerParam({status: null});
    this.AddWriteAnswerParam({status: null, class:null});
  }
    
  ShowChat(div)
  {
    super.ShowChat(div);
    
    if(this.GetRequestType() == "write")
    {
      const value = this.GetValue();
      _CN("span", {}, [value?.status == 1 ? "ACTIVE" : "INACTIVE"], div);
    }
  }
};
