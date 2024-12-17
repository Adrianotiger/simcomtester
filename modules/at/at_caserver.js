let AT_CASERVER = new class extends ATBase
{  
  #cid = 0;
  #result = 0;

  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true, 
      read: true,
      test: true,
      description: "Open a TCP/UDP Server",
      example: "+CASERVER:(0-12),(0-4),(\"TCP\",\"TCP6\",\"UDP\",\"UDP6\"),(1-65535),(0,1)",
      cmd: "AT+CASERVER",
      doc: "12.2.4"
    });
    
    let enumR = [];
    enumR.push(new ATEnum(0, "Read manually received data (+CARECV)"));
    enumR.push(new ATEnum(1, "Report received data (+CAURC)"));
    
    let enumConn = [];
    enumConn.push(new ATEnum("TCP", "TCP"));
    enumConn.push(new ATEnum("TCP6", "TCP6"));
    enumConn.push(new ATEnum("UDP", "UDP"));
    enumConn.push(new ATEnum("UDP6", "UDP6"));
    
    let enumId = [];
    for(var j=0;j<=12;j++)
      enumId.push(new ATEnum(j, "CID #" + j));
    let enumPdp = [];
    for(var j=0;j<=4;j++)
      enumPdp.push(new ATEnum(j, "PDP #" + j));
    
    
    this.AddParam("cid", enumId, "Command identifier");
    this.AddParam("pdp_index", enumPdp, "PDP connection index");
    this.AddParam("conn_type", enumConn, "Transfer type");
    this.AddParam("port", "number", "Server port (1-65535)");
    this.AddParam("result", "number", "Result code");
    this.AddParam("recv_mode", enumR, "Receive mode");
    
    this.AddWriteSendParam({cid:null, pdp_index:null, conn_type:null, port:null, recv_mode:null});
    this.AddWriteSendParam({cid:null, pdp_index:null, conn_type:null, port:null});
        
    this.AddWriteAnswerParam({cid:null, result:null});

    this.AddReadAnswerParam({cid:null, pdp_index:null, conn_type:null, port:null, recv_mode:null});
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