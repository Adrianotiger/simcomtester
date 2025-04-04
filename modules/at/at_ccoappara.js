let AT_CCOAPPARA = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true,
      test: true,
      description: "Assembling CoAP Data Packet",
      cmd: "AT+CCOAPPARA",
      doc: "18.2.5"
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

    let enumT = [];
    enumT.push(new ATEnum("CON", "Confirmable"));
    enumT.push(new ATEnum("NON", "Non confirmable"));
    enumT.push(new ATEnum("ACK", "Acknowledgement"));
    enumT.push(new ATEnum("RST", "Reset"));

    let enumCodex = [];
    enumCodex.push(new ATEnum(0, "ASCII-format"));
    enumCodex.push(new ATEnum(1, "HEX-format"));
    
    this.AddParam("code", enumC, "code");
    this.AddParam("type", enumT, "code");
    this.AddParam("uripath", "string", "uri path");
    this.AddParam("token", "string", "token");
    this.AddParam("uriquery", "string", "uri query");
    this.AddParam("payload", "string", "payload");
    this.AddParam("etag", "string", "etag");
    this.AddParam("mid", "number", "message id");
    this.AddParam("codex", enumCodex, "value format");
    this.AddParam("cont_format", "number", "Content format");
    this.AddParam("accept", "number", "Accept");
    this.AddParam("observe", "number", "Observe");
    this.AddParam("max_age", "number", "Max age");
    this.AddParam("size", "number", "Payload length");
        
    for(var j=0;j<30;j++)
    {
      this.AddParam("param" + j, "string", "code");
    }

    this.AddWriteSendParam({param0:"CODE", code:null});
    this.AddWriteSendParam({param0:"TYPE", type:null});
    this.AddWriteSendParam({param0:"MID", mid:null});
    this.AddWriteSendParam({param0:"TOKEN", codex:null, token:null});
    this.AddWriteSendParam({param0:"CONTENT-FORMAT", cont_format:null});
    this.AddWriteSendParam({param0:"ACCEPT", accept:null});
    this.AddWriteSendParam({param0:"URI-PATH", codex:null, uripath:null});
    this.AddWriteSendParam({param0:"URI-QUERY", codex:null, uriquery:null});
    this.AddWriteSendParam({param0:"ETAG", codex:null, etag:null});
    this.AddWriteSendParam({param0:"OBSERVE", observe:null});
    this.AddWriteSendParam({param0:"MAX-AGE", max_age:null});
    this.AddWriteSendParam({param0:"SIZE", size:null});
    this.AddWriteSendParam({param0:"PAYLOAD", codex:null, payload:null});
    
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