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
      cmd: "AT+CCOAPHEAD"
    });//false, true, false, true, "Read Head of CoAP Packet", "+CCOAPHEAD: 1,1,2,0,4.04,1,,,,,,,0,,,,,,,,", "AT+CCOAPHEAD", 1000);
        
    let enumC = [];
    enumC.push(new ATEnum(0, "Print data in raw mode"));
    enumC.push(new ATEnum(1, "Print data after parsing"));
    
    this.AddParam("convert", enumC, "convert");
    this.AddParam("ver", "string", "convert");
    this.AddParam("type", "string", "convert");
    this.AddParam("tkl", "string", "convert");
    this.AddParam("code", "string", "convert");
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