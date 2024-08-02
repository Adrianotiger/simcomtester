let AT_CFSWFILE = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true,
      description: "Write File to the Flash Buffer Allocated by CFSINIT",
      cmd: "AT+CFSWFILE",
      doc: "9.2.2"
    }); //false, true, false, false, "Write File to the Flash Buffer Allocated by CFSINIT", "", "AT+CFSWFILE", 1000);
    
    let enumI = [];
    enumI.push(new ATEnum(0, "/custapp/"));
    enumI.push(new ATEnum(1, "/fota/"));
    enumI.push(new ATEnum(2, "/datatx/"));
    enumI.push(new ATEnum(3, "/customer/"));
        
    let enumM = [];
    enumM.push(new ATEnum(0, "write the data at the beginning of the file"));
    enumM.push(new ATEnum(1, "add the data at the end of the file"));
    
    
    this.AddParam("index", enumI, "directory index");
    this.AddParam("filename", "string", "file name");
    this.AddParam("mode", enumM, "overwrite mode");
    this.AddParam("filesize", "number", "file size");
    this.AddParam("inputtime", "number", "timeout for sending file in ms");
    
    this.AddWriteSendParam({index:null, filename:null, mode:null, filesize:null, inputtime:null});
  }
  
  HoldUp(str)
  {
    if(str.indexOf("OK") < 0) return true;
    return false;
  }
};