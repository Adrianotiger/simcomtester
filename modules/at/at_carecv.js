let AT_CARECV = new class extends ATBase
{ 
  #len = 0;
  #ip = "";
  #ipport = 0;
  #out = "";

  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true, 
      test: true,
      description: "Receive data via an established connection",
      example: "+CARECV: (0-12),(1-1460)",
      cmd: "AT+CARECV",
      doc: "12.2.6"
    });
        
    let enumId = [];
    for(var j=0;j<=12;j++)
      enumId.push(new ATEnum(j, "CID #" + j));
    
    this.AddParam("cid", enumId, "TCP/UDP identifier");
    this.AddParam("readlen", "number", "Requested number of data bytes to be read");
    this.AddParam("recvlen", "number", "Data bytes that has been actually received");
    this.AddParam("remote_ip", "string", "Remote IP");
    this.AddParam("remote_port", "number", "Remote Port");
    this.AddParam("data", "string", "Output Data");
    
    this.AddWriteSendParam({cid:null, readlen:null});
    
    this.AddWriteAnswerParam({recvlen:null});
    this.AddWriteAnswerParam({recvlen:null, data:null});
    this.AddWriteAnswerParam({recvlen:null, remote_ip:null, remote_port:null, data:null});
  }
  
  Parse(str)
  {
    super.Parse(str);
    this.#ip = "";
        
    this.GetLines().forEach(l=>{
      if(this.value == "") this.value = l;
      if(l.trim().length >= 4)
      {
        const values = l.substring(this.GetCmd().length-1).trim().split(",");
        if(values.length >= 4)
        {
          this.#len = parseInt(values[0]);
          this.#ip = values[1];
          this.#ipport = parseInt(values[2]);
          this.#out = values[3];
        }
        else
        {
          this.#len = parseInt(values[0]);
          this.#out = values[3];
        }
      }
      
    });
    return this.value;
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    if(this.GetRequestType() == "write")
    {
      _CN("span", {}, ["[len: " + this.#len + "]"], div);
      if(parseInt(this.#len) > 0)
        _CN("span", {style:"font-style:italic;"}, [this.#out], div);
    }
    
  }
  
};