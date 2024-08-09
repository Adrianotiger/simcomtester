let AT_CCLK = new class extends ATBase
{
  constructor()
  {
        //read, write, exe, test, description, example, cmd, timeout)
    super({
      read: true,
      write: true,
      test: true,
      description: "Clock",
      example: "+CCLK: \"80/01/06,00:37:28+00\"",
      cmd: "AT+CCLK",
      doc: "3.2.20"
    });
    
    this.AddParam("time", "string", "time");
    
    this.AddReadAnswerParam({time:null});
    this.AddWriteSendParam({time:null});
  }
    
  ShowChat(div)
  {
    super.ShowChat(div);
    
    const value = this.GetValue();
    
    if(this.GetRequestType() == "read")
    {
      let dt = GetTime();
      const optionsDate = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
      const optionsTime = { timeZoneName: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" };
      _CN("span", {}, [dt.toLocaleDateString(undefined, optionsDate)], div);
      _CN("span", {}, [dt.toLocaleTimeString(undefined, optionsTime)], div);
    }
  }
  
  GetTime()
  {
    const value = this.GetValue();
    
    // 80/01/06,00:37:28+00
    let dt = value.time.replace(/"/g,'').split(",");
    let d = dt[0].split("/");
    let t = dt[1].split("+")[0].split(":");
    
    const ret = new Date(parseInt(d[0])+2000, parseInt(d[1])-1, parseInt(d[2]), parseInt(t[0]), parseInt(t[1]), parseInt(t[2]));
    return ret;
  }
  
  ConvertTime(javascriptTime)
  {
    let t = javascriptTime;
    let f = (t.getFullYear() % 100) + "/" + (t.getMonth() + 1).toString().padStart(2, '0') + "/" + (t.getDate()).toString().padStart(2, '0') + ",";
    f += (t.getHours()).toString().padStart(2, '0') + ":" + (t.getMinutes()).toString().padStart(2, '0') + ":" + (t.getSeconds()).toString().padStart(2, '0');          
    return "\"" + f + "\"";
  }
};
