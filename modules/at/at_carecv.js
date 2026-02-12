let AT_CASERVER = new class extends ATBase
{  
  #cid = 0;
  #result = 0;

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
        
    this.AddWriteAnswerParam({recvlen:null, data:null});
    this.AddWriteAnswerParam({recvlen:null, remote_ip:null, remote_port:null, data:null});
  }
  
  Parse(str)
  {
    super.Parse(str);
        
    this.GetLines().forEach(l=>{
      if(this.value == "") this.value = l;
      if(l.trim().length >= 4)
      {
        const values = l.substring(this.GetCmd().length-1).trim().split(",");
        this.#cid = parseInt(values[0]);
        this.#result = parseInt(values[1]);
      }
    });
    return this.value;
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    this.GetLines().forEach(l=>{
      if(l.trim().length > 1)
      {
        const values = l.substring(this.GetCmd().length-1).trim().split(",");
        if(values.length >= 2)
        {
          _CN("span", {}, ["cid: " + this.#cid], div);
          _CN("span", {}, ["result: " + this.#parseResult()], div);
        }
      }
    });
  }
  
  #parseResult()
  {
    switch(this.#result)
    {
      case 0: return "Success";
      case 1: return "Socket error";
      case 2: return "No memory";
      case 3: return "Connection limit";
      case 4: return "Parameter invalid";
      //case 5:
      case 6: return "Invalid IP address";
      case 7: return "Unsupported function";
      //case 8: return "Session type mismatch";
      //case 9: return "Session closed but not released";
      //case 10: return "Illegal operation";
      //case 11: return "Unable to close socket";
      case 12: return "Unable to bind port";
      case 13: return "Unable to listen port";
      //case 14-17:
      //case 18: return "Connect failed";
      //case 19:
      case 20: return "Unable to resolve host";
      case 21: return "Network not active";
      //case 22:
      case 23: return "Remote refuse";
      case 24: return "Certificate time expired";
      case 25: return "Certificate common name mismatch";
      case 26: return "Certificate common name mismatch and time expired";
      case 27: return "SSL connection failed";

      default: return "Unknown result";
    }
  }
  
};