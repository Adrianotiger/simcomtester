let AT_CFSGFRS = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      description: "Get the Size of File System",
      cmd: "AT+CFSGFRS",
      doc: "9.2.7"
    });
    
    this.AddParam("n", "number", "bytes");
    
    this.AddReadAnswerParam({n:null});
  }
  
  ShowChat(div)
  {
    super.ShowChat(div);
    
    const value = this.GetValue();
    
    //if(this.GetRequestType() == "exe")
    {
      let freespace = value.n + " bytes";
      if(value.n > 1024 * 1024 * 2) freespace = (parseInt(value.n / 1024 / 10.24) / 100) + " MB";
      else if(value.n > 1024 * 5) freespace = parseInt(value.n / 1024) + " kB";
      _CN("span", {}, ["free space: " + freespace], div);
    }
  }
};