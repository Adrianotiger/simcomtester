let AT_SHCONF = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Set HTTP(S) Parameter",
      example: "+SHCONF: URL: 0.0.0.0:80",
      cmd: "AT+SHCONF",
      doc: "13.2.1"
    });
    
    let enumC = [];
    enumC.push(new ATEnum("URL", "URL"));
    enumC.push(new ATEnum("TIMEOUT", "TIMEOUT"));
    enumC.push(new ATEnum("BODYLEN", "BODYLEN"));
    enumC.push(new ATEnum("HEADERLEN", "HEADERLEN"));
    enumC.push(new ATEnum("POLLCNT", "POLLCNT"));
    enumC.push(new ATEnum("POLLINTMS", "POLLINTMS"));
    enumC.push(new ATEnum("IPVER", "IPVER"));
    
    let enumI = [];
    enumI.push(new ATEnum(0, "IP v4"));
    enumI.push(new ATEnum(1, "IP v6"));
    
    
    this.AddParam("param", enumC, "parameter");
    this.AddParam("url", "string", "url");
    this.AddParam("timeout", "number", "timeout");
    this.AddParam("headerlen", "number", "header length");
    this.AddParam("pollcnt", "number", "poll count");
    this.AddParam("pollintms", "number", "poll timeout ms");
    this.AddParam("bodylen", "number", "body length");
    this.AddParam("ipver", enumI, "ip version");
    this.AddParam("dummy", "string", "dummy");
    
    this.AddWriteSendParam({param:"URL", url:null});
    this.AddWriteSendParam({param:"TIMEOUT", timeout:null});
    this.AddWriteSendParam({param:"BODYLEN", bodylen:null});
    this.AddWriteSendParam({param:"HEADERLEN", headerlen:null});
    this.AddWriteSendParam({param:"POLLCNT", pollcnt:null});
    this.AddWriteSendParam({param:"POLLINTMS", pollintms:null});
    this.AddWriteSendParam({param:"IPVER", ipver:null});
    
    this.AddReadAnswerParam({param:null, dummy:null});
  }
};