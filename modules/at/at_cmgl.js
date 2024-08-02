let AT_CMGL = new class extends ATBase
{
  #messages = [];
  
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true,
      exe: true,
      test: true,
      description: "List SMS Messages from Preferred Store",
      example: "+CMGL: 1,2,,18",
      cmd: "AT+CMGL",
      timeout: 20000,
      doc: "4.2.3"
    });// true, true, false, true, "Enter/Read PIN", "+CPIN: READY", "AT+CPIN", 5000);
    
    let enumS = [];
    enumS.push(new ATEnum(0, "Received unread messages"));
    enumS.push(new ATEnum(1, "Received read messages"));
    enumS.push(new ATEnum(2, "Stored unsent messages"));
    enumS.push(new ATEnum(3, "Stored sent messages"));
    enumS.push(new ATEnum(4, "All messages"));
    enumS.push(new ATEnum("REC UNREAD", "Received unread messages"));
    enumS.push(new ATEnum("REC READ", "Received read messages"));
    enumS.push(new ATEnum("STO UNSENT", "Stored unsent messages"));
    enumS.push(new ATEnum("STO SENT", "Stored sent messages"));
    enumS.push(new ATEnum("ALL", "All messages"));
    
    let enumM = [];
    enumM.push(new ATEnum(0, "Normal"));
    enumM.push(new ATEnum(1, "Not change status of the specified SMS record"));
    
    this.AddParam("stat", enumS, "stat");
    this.AddParam("mode", enumM, "mode");
    this.AddParam("index", "number", "sms index");
    this.AddParam("alpha", "string", "alpha");
    this.AddParam("oada", "string", "originating address");
    this.AddParam("scts", "number", "service center timestamp");
    this.AddParam("tooa", "string", "destination address");
    this.AddParam("length", "number", "message length");
        
    this.AddWriteSendParam({stat:null});
    this.AddWriteSendParam({stat:null, mode:null});
    
    this.AddWriteAnswerParam({index:null, stat:null, oada:null});
    this.AddWriteAnswerParam({index:null, stat:null, oada:null, alpha:null});
    this.AddWriteAnswerParam({index:null, stat:null, oada:null, alpha:null, scts:null});
    this.AddWriteAnswerParam({index:null, stat:null, oada:null, alpha:null, scts:null, tooa:null, length:null});
  }
  
  Parse(str)
  {
    super.Parse(str);
    
    str = str.trim();
    const cmgls = str.substring(0, str.length - (str.endsWith("OK")?4:0)).trim().split("+CMGL:");
    
    this.#messages = [];
    
    console.log("CMGL:", str);
    
    cmgls.forEach(cmgl=>{
      if(cmgl.trim().length > 5)
      {
        let cmg = cmgl.trim().split("\n");
        let cmg0 = super.Comma2List(cmg[0].trim());
        let o = {};
        o.raw = cmgl;
        o.index = cmg0[0];
        o.stat = cmg0[1];
        o.from = cmg0[2];
        o.alpha = cmg0[3];
        o.time = cmg0[4];
        o.msg = "";
        for(let k=1;k<cmg.length;k++) 
        {
          if(k > 1) o.msg += "\n";
          o.msg += cmg[k].trim();
        }
        console.log(cmgl, o);
        this.#messages.push(o);
      }
    });
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    const value = this.GetValue();
    
    if(this.GetRequestType() == "write" || this.GetRequestType() == "read")
    {
      _CN("span", {}, [this.GetParam("stat").GetValue(value.stat.replace(/"/g,''))?.GetDescription()], div);
    }
  }
  
  
  GetMessages()
  {    
    return this.#messages;
  }
  
};