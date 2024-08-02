let AT_CFSDFILE = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      write: true,
      description: "Delete the File from the Flash",
      cmd: "AT+CFSDFILE",
      doc: "9.2.4"
    }); //false, true, false, false, "Delete the File from the Flash", "", "AT+CFSDFILE", 1000);
    
    let enumI = [];
    enumI.push(new ATEnum(0, "/custapp/"));
    enumI.push(new ATEnum(1, "/fota/"));
    enumI.push(new ATEnum(2, "/datatx/"));
    enumI.push(new ATEnum(3, "/customer/"));
    
    this.AddParam("index", enumI, "directory index");
    this.AddParam("filename", "string", "file name");
    
    this.AddWriteSendParam({index:null, filename:null});
  }
};