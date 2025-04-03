let AT_CCOAPHEAD = new class extends ATBase
{
  #heads = [];
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true, 
      test: true,
      description: "Read Head of CoAP Packet",
      example: "+CCOAPHEAD: 1,1,2,0,4.04,1,,,,,,,0,,,,,,,,",
      cmd: "AT+CCOAPHEAD",
      doc: "18.2.7"
    });//false, true, false, true, "Read Head of CoAP Packet", "+CCOAPHEAD: 1,1,2,0,4.04,1,,,,,,,0,,,,,,,,", "AT+CCOAPHEAD", 1000);
        
    let enumC = [];
    enumC.push(new ATEnum(0, "Print data in raw mode"));
    enumC.push(new ATEnum(1, "Print data after parsing"));

    let enumT = [];
    enumT.push(new ATEnum(0, "Req. Confirmable"));
    enumT.push(new ATEnum(1, "Req. Non-confirmable"));
    enumT.push(new ATEnum(2, "Resp. Acknowledgement"));
    enumT.push(new ATEnum(3, "Resp. Reset"));

    let enumCode = [];
    enumCode.push(new ATEnum("0.00", "Method:EMPTY"));
    enumCode.push(new ATEnum("0.01", "Method:GET"));
    enumCode.push(new ATEnum("0.02", "Method:POST"));
    enumCode.push(new ATEnum("0.03", "Method:PUT"));
    enumCode.push(new ATEnum("0.04", "Method:DELETE"));
    enumCode.push(new ATEnum("0.05", "Method:FETCH"));
    enumCode.push(new ATEnum("0.06", "Method:PATCH"));
    enumCode.push(new ATEnum("0.07", "Method:iPATCH"));
    enumCode.push(new ATEnum("2.01", "Success:Created"));
    enumCode.push(new ATEnum("2.02", "Success:Deleted"));
    enumCode.push(new ATEnum("2.03", "Success:Valid"));
    enumCode.push(new ATEnum("2.04", "Success:Changed"));
    enumCode.push(new ATEnum("2.05", "Success:Content"));
    enumCode.push(new ATEnum("2.31", "Success:Continue"));
    enumCode.push(new ATEnum("4.00", "Client Err:Bad Request"));
    enumCode.push(new ATEnum("4.01", "Client Err:Unauthorized"));
    enumCode.push(new ATEnum("4.02", "Client Er:Bad Option"));
    enumCode.push(new ATEnum("4.03", "Client Err:Forbidden"));
    enumCode.push(new ATEnum("4.04", "Client Err:Not Found"));
    enumCode.push(new ATEnum("4.05", "Client Err:Method Not Allowed"));
    enumCode.push(new ATEnum("4.06", "Client Err:Not Acceptable"));
    enumCode.push(new ATEnum("4.08", "Client Err:Req Enty.Incomplete"));
    enumCode.push(new ATEnum("4.09", "Client Err:Conflict"));
    enumCode.push(new ATEnum("4.12", "Client Err:Precondition Failed"));
    enumCode.push(new ATEnum("4.13", "Client Err:Req Enty Too Large"));
    enumCode.push(new ATEnum("4.15", "Client Err:Invalid Content-Format"));
    enumCode.push(new ATEnum("5.00", "Server Err:Internal server err."));
    enumCode.push(new ATEnum("5.01", "Server Err:Not implemented"));
    enumCode.push(new ATEnum("5.02", "Server Err:Bad gateway"));
    enumCode.push(new ATEnum("5.03", "Server Err:Service unavailable"));
    enumCode.push(new ATEnum("5.04", "Server Err:Gateway timeout"));
    enumCode.push(new ATEnum("5.05", "Server Err:Proxying not supported"));
    enumCode.push(new ATEnum("7.00", "Signaling Codes: Unassigned"));
    enumCode.push(new ATEnum("7.01", "Signaling Codes: CSM"));
    enumCode.push(new ATEnum("7.02", "Signaling Codes: Ping"));
    enumCode.push(new ATEnum("7.03", "Signaling Codes: Pong"));
    enumCode.push(new ATEnum("7.04", "Signaling Codes: Release"));
    enumCode.push(new ATEnum("7.05", "Signaling Codes: Abort"));
    
    
    this.AddParam("convert", enumC, "convert");
    this.AddParam("ver", "number", "convert");
    this.AddParam("type", enumT, "convert");
    this.AddParam("tkl", "number", "convert");
    this.AddParam("code", enumCode, "convert");
    this.AddParam("mid", "number", "message ID");
    this.AddParam("token", "string", "convert");
    this.AddParam("contentformat", "string", "convert");
    this.AddParam("maxage", "string", "convert");
    this.AddParam("etag", "string", "convert");
    this.AddParam("accept", "string", "convert");
    this.AddParam("ifmatch", "string", "convert");
    this.AddParam("ifnonematch", "string", "convert");
    this.AddParam("urihost", "string", "convert");
    this.AddParam("uriport", "string", "convert");
    this.AddParam("uripath", "string", "convert");
    this.AddParam("uriquery", "string", "convert");
    this.AddParam("locationpath", "string", "convert");
    this.AddParam("locationquery", "string", "convert");
    this.AddParam("proxyuri", "string", "convert");
    this.AddParam("observe", "string", "convert");
    this.AddParam("block2", "string", "convert");
    this.AddParam("block1", "string", "convert");
    this.AddParam("size", "string", "convert");
    
    this.AddParam("length", "string", "convert");
    this.AddParam("data", "string", "convert");
    
    this.AddWriteAnswerParam({convert:null, length:null, data:null});
    this.AddWriteAnswerParam({convert:null, ver:null, type:null, tkl:null, code:null, mid:null, token:null, contentformat:null, maxage:null, etag:null, accept:null, ifmatch:null,
                                ifnonematch:null, urihost:null, uriport:null, uripath:null, uriquery:null, locationpath:null, locationquery:null, proxyuri:null, observe:null,
                                block2:null, block1:null, size:null});
                              
    this.AddWriteSendParam({mid:null, convert:null});
  }
  
  Parse(str)
  {
    super.Parse(str);
    
    this.#heads = [];
    
    let index = 0;
    this.GetLines().forEach(l=>{
      if(this.value == "") this.value = l;
      if(l.indexOf("+CCOAPHEAD:") === 0)
      {
        if(this.GetRequestType() == "write")
        {
          const values = l.substring(this.GetCmd().length-1).trim().split(",");
          
          if(values.length >= 3)
          {
            this.#heads['convert'] = parseInt(values[0]);
            let i = 1;
            if(this.#heads['convert'] == 0)
            {
              this.#heads['length'] = values[i++];
              this.#heads['data'] = values[i++];
            }
            else if(this.#heads['convert'] == 1)
            {
              this.#heads['ver'] = values[i++];
              this.#heads['type'] = values[i++];
              this.#heads['tkl'] = values[i++];
              this.#heads['code'] = values[i++];
              this.#heads['mid'] = values[i++];
              this.#heads['token'] = values[i++];
              this.#heads['content-format'] = values[i++];
              this.#heads['max-age'] = values[i++];
              this.#heads['etag'] = values[i++];
              this.#heads['accept'] = values[i++];
              this.#heads['if-match'] = values[i++];
              this.#heads['if-none-match'] = values[i++];
              this.#heads['uri-host'] = values[i++];
              this.#heads['uri-port'] = values[i++];
              this.#heads['uri-path'] = values[i++];
              this.#heads['uri-query'] = values[i++];
              this.#heads['location-path'] = values[i++];
              this.#heads['location-query'] = values[i++];
              this.#heads['proxy-uri'] = values[i++];
              this.#heads['observe'] = values[i++];
              this.#heads['block2'] = values[i++];
              this.#heads['block1'] = values[i++];
              this.#heads['size'] = values[i++];
            }
          }
        }
        index++;
      }
    });
    return this.value;
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    this.GetLines().forEach(l=>{
      if(l.indexOf("+CCOAPHEAD:") === 0 && this.GetRequestType() == "write")
      {
        const values = l.substring(this.GetCmd().length-1).trim().split(",");
        if(values.length >= 3)
        {
          _CN("span", {}, ["convert: " + this.#heads['convert']], div);
          if(this.#heads['convert'] == 0)
          {
            _CN("span", {}, ["length: " + this.#heads['length']], div);
            _CN("span", {}, ["data: " + this.#heads['data']], div);
          }
          else if(this.#heads['convert'] == 1)
          {
            Object.keys(this.#heads).forEach(k=>{
              if(this.#heads[k].length > 0)
              {
                _CN("span", {}, [k + ": " + this.#heads[k]], div);
              }
            });
          }
          else
          {
            _CN("span", {}, ["Invalid convert type!"], div);
          }
        }
      }
    });
  }
};