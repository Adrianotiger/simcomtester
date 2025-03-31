let AT_CBANDCFG = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Configure CAT-M or NB-IOT Band",
      example: "+CBANDCFG: \"NB-IOT\",8,20",
      cmd: "AT+CBANDCFG",
      doc: "5.2.26"
    }); 
    
    let enumMode = [];
    enumMode.push(new ATEnum("CAT-M", "CAT-M"));
    enumMode.push(new ATEnum("NB-IOT", "NB-IoT"));
    this.AddParam("mode", enumMode, "mode");

    this.AddParam("band", "integer", "band");
    for(var j=1;j<20;j++) this.AddParam("band" + j, "integer", "band");
    
    let o = {mode:null, band:null};
    this.AddReadAnswerParam(o);
    this.AddWriteSendParam(o);
    for(var j=1;j<20;j++) {
      let ox = {...o};
      ox["band" + j] = null;
      this.AddReadAnswerParam(ox); 
      this.AddWriteSendParam(ox); 
    } 
  }
};