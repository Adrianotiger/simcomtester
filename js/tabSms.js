class TabSms
{
  Title = "SMS";
  #table = {};
  
  constructor()
  {
    this.div = _CN("div", {class:"box tab"}, [_CN("h2", {}, ["SMS"])], Tabs.GetDiv());
    this.messageTextMode = null;
    this.phoneNr = null;
    this.msg = null;
    
    setTimeout(()=>{
      this.Init();
      
      window.addEventListener("serial", (data)=>{
        if(data.detail.cmd?.GetCmd() == "AT+CMGF")
        {
          this.messageTextMode = AT_CMGF.IsTextMode();
        }
      });
    }, 200);
  }
  
  Init()
  {
    //this.div.appendChild(Settings.GetGroupDiv("apn"));
    //this.div.appendChild(Settings.GetGroupDiv("ssl"));
    
    this.div.appendChild(
      Tabs.AddCmd(
        "GET Message Mode", 
        ()=>{
          AT_CMGF.Read().then(()=>{});
        },
        AT_CMGF)
    );
    
    this.#table.el = _CN("table", {border:1,style:"max-height:40vh;overflow-y:auto;"}, [], this.div);
    this.#table.rows = [];
    
    _CN("button", {style:"margin:1vh;"}, ["GET SMS"], this.div).addEventListener("click", ()=>{
      this.GetSMS();
    });
    
    this.phoneNr = _CN("input", {type:"text", value:"", title:"sms_to_nr"});
    _CN("div", {class:"paramdiv"}, [_CN("p", {}, ["Phone number to deliver sms", this.phoneNr])], this.div);
    Settings.AutoSaveChanges(this.phoneNr);
    
    this.msg = _CN("input", {type:"text", value:"", maxlength:160, title:"sms_to_msg"});
    _CN("div", {class:"paramdiv"}, [_CN("p", {}, ["Message to send (max 160 chars)", this.msg])], this.div);
    Settings.AutoSaveChanges(this.msg);
    
    _CN("button", {style:"margin:1vh;"}, ["SEND SMS"], this.div).addEventListener("click", ()=>{
      this.SendSMS();
    });
    
    _CN("button", {style:"margin:1vh;"}, ["SEND ESC"], this.div).addEventListener("click", ()=>{
      this.SendESC();
    });
  }
  
  Select()
  {
    if(this.messageTextMode == null)
    {
      AT_CMGF.Read();
    }
  }
  
  GetSMS()
  {
    this.SetTextMode().then(()=>{
       AT_CMGL.Write(["\"ALL\"", 1]).then(()=>{
         let first = true;
         AT_CMGL.GetMessages().forEach(m=>{
           this.AddTableRow(m, first);
           first = false;
         });
       }).catch((e)=>{this.#Error("Unable to get messages", e);});
    }).catch((e)=>{this.#Error("Unable to set text mode", e);});
  }
  
  SendESC()
  {
    SIMSerial.SendChar(27);
  }
  
  SendSMS()
  {
    const event = new CustomEvent("cominfo", { detail: {info:""} });
    
    this.SetTextMode().then(()=>{
      let abortSMS = false;
      setTimeout(()=>{
        if(abortSMS) return;
        console.log("send data...");
        SIMSerial.SendData(this.msg.value);
        setTimeout(()=>{
          SIMSerial.SendChar(26);
        }, 200);
      }, 1000);
      
      let phoneNr = this.phoneNr.value;
      phoneNr = phoneNr.replace(/"/g, '');
      phoneNr = '"' + phoneNr + '"';
      AT_CMGS.Write([phoneNr]).then(()=>{
        abortSMS = true;
        event.detail.info = "SMS successfully sent";
        window.dispatchEvent(event);
      }).catch((e)=>{abortSMS = true; this.#Error("Unable to send messages", e);});
    }).catch((e)=>{this.#Error("Unable to set text mode", e);});
  }
  
  AddTableRow(data, clear=false)
  {
    if(clear)
    {
      [...this.#table.el.getElementsByTagName("tr")].forEach(tr=>{this.#table.el.removeChild(tr);});
      this.#table.rows = [];
      _CN("tr", {}, [_CN("th",{},["index"]), _CN("th",{},["state"]), _CN("th",{},["from"]), _CN("th",{},["time"])], this.#table.el);
    }
    const smstypes = ["✉", "💌","📤","📩","🗂️"];
    let row = {el:null, data:null, open:false};
    let tds = [];
    let stat = data.stat.replace(/"/g, '');
    let smstype = smstypes[4];
    if(stat == 0 || stat == "REC UNREAD") smstype = smstypes[0];
    else if(stat == 1 || stat == "REC READ") smstype = smstypes[1];
    else if(stat == 2 || stat == "STO UNSENT") smstype = smstypes[2];
    else if(stat == 3 || stat == "STO SENT") smstype = smstypes[3];
    tds.push(_CN("th", {}, [data.index]));
    tds.push(_CN("td", {title:stat}, [smstype]));
    tds.push(_CN("td", {}, [data.from]));
    tds.push(_CN("td", {}, [data.time]));
    row.data = data;
    row.el = _CN("tr", {}, tds, this.#table.el);
    row.el.addEventListener("click", ()=>{
      if(!row.open) 
      {
        this.#AddTableMessage(row);
      }
      else 
      {
        this.#table.el.removeChild(row.el.nextSibling);
        row.open = false;
      }
    });
  }
  
  #AddTableMessage(row)
  {
    row.open = true;
    let remove = _CN("a", {style:"color:#a00;float:right;"}, ["🗑️"]);
    let nrow = _CN("tr", {}, [_CN("td",{},[]), _CN("td",{colspan:3},[row.data.msg,_CN("br"),remove])]);
    this.#table.el.insertBefore(nrow, row.el.nextSibling)
    
    remove.addEventListener("click", ()=>{
      AT_CMGD.Write([row.data.index, 0]).then(()=>{
        this.#table.el.removeChild(nrow.previousSibling);
        this.#table.el.removeChild(nrow);
      }).catch((e)=>{this.#Error("Unable to set delete message", e);});
    });
  }
  
  SetTextMode()
  {
    return new Promise((res,rej)=>
    {
      if(this.messageTextMode)
      {
        res();
      }
      else
      {
        AT_CMGF.Write([1]).then(()=>{
          res();
        }).catch(()=>{rej();});
      }
    });
  }
  
  
  
  #Error(msg, e, o = {})
  {
    console.error("SMS ERROR", e);
    const event = new CustomEvent("cominfo", { detail: {error:msg, event:e} });
    window.dispatchEvent(event);
    
  }
  
}

Tabs.AddTab(new TabSms());