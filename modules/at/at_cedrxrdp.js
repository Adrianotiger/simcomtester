let AT_CEDRXRDP = new class extends ATBase
{  
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      exe: true,
      test: true,
      description: "eDRX Read Dynamic Parameters",
      example: "+CEDRXRDP: 0",
      cmd: "AT+CEDRXRDP",
      doc: "5.2.44"
    });
    
    let enumA = [];
    enumA.push(new ATEnum(0, "Access technology is not using eDRX"));
    enumA.push(new ATEnum(4, "E-UTRAN (CAT-M1)"));
    enumA.push(new ATEnum(5, "E-UTRAN (NB-S1mode)"));
        
    this.AddParam("act", enumA, "AcT-type");
    this.AddParam("req_edrx_value", "string", "Requested_eDRX_value");
    this.AddParam("prov_edrx_value", "string", "NW-provided_eDRX_value");
    this.AddParam("paging_time", "string", "Paging_time_window");
    
    this.AddExeAnswerParam({act:null});
    this.AddExeAnswerParam({act:null, req_edrx_value:null});
    this.AddExeAnswerParam({act:null, req_edrx_value:null, prov_edrx_value:null});
    this.AddExeAnswerParam({act:null, req_edrx_value:null, prov_edrx_value:null, paging_time:null});
  }

};
