class TabScript
{
  Title = "Scripts";

  #frontDiv = null;
  #backDiv = null;
  #linesDiv = null;
  #lastTimestamp = 0;
  #updatingText = false;
  #cmdList = null;
  #paramList = null;
  #executingLine = null;
  #infoLine = null;
  #infoLineTimeout = null;
  #LINE = 22;
  
  constructor()
  {
    this.div = _CN("div", {class:"box tab tabscript"}, [_CN("h2", {}, ["Scripts"])], Tabs.GetDiv());

    setTimeout(()=>{this.#init();}, 500);
  }

  #init()
  {
    let toolbar = _CN("div", {}, [], this.div);

    _CN("button", {class:"icon", title:"save current script"}, ["💾"],toolbar).addEventListener("click", ()=>{
      localStorage.setItem("gsm_script_file", this.#frontDiv.textContent);
    });
    _CN("button", {class:"icon", title:"load saved script"}, ["📂"],toolbar).addEventListener("click", ()=>{
      this.#frontDiv.textContent = localStorage.getItem("gsm_script_file", "AT");
      this.#updateText();
    });
    _CN("button", {class:"icon", title:"execute"}, ["⚡"],toolbar).addEventListener("click", ()=>{
      this.Execute();
    });
    _CN("i", {style:"padding-left:30px;"}, [" | Create scripts and automate the process"], toolbar);

    let divMain = _CN("div", {class:"tabscriptmain"}, [], this.div);
    this.#linesDiv = _CN("div", {class:"tabscripteditor tabscriptlines"}, [], divMain);
    this.#frontDiv = _CN("div", {class:"tabscripteditor", contenteditable:"plaintext-only"}, [], divMain);
    this.#backDiv = _CN("div", {class:"tabscripteditor", style:"pointer-events:none;left:0px;top:0px;opacity:1;"}, [], divMain);
    this.#executingLine = _CN("b", {}, ["⚡"], this.#linesDiv);

    this.#infoLine = _CN("div", {class:"tabscriptinfo"}, [], this.div);

    for(let j=1;j<200;j++)
      _CN("div", {}, [j], this.#linesDiv);

    this.#frontDiv.addEventListener("scroll", (e)=>{
      this.#backDiv.scrollTo(0 , this.#frontDiv.scrollTop);
      this.#linesDiv.scrollTo(0 , this.#frontDiv.scrollTop);
    });

    this.#frontDiv.addEventListener("input", (e)=>{
      console.log("input", e);
      this.#updateText(Number.parseInt(e.timeStamp));
      return this.#writeLetter(e);
    });

    this.#frontDiv.addEventListener("keydown", (e)=>{
      console.log("keydown", e);
      if(e.code == "Escape")
      {
        return this.#writeLetter(e);
      }
    });

    this.#cmdList = _CN("select", {size:5, style:"position:absolute;left:0px;top:0px;display:none;width:200px;height:130px;font-size:12px;z-index:1001;"}, [], document.body);
    Object.keys(ATs).forEach(k=>{
      _CN("option", {value:k}, [k], this.#cmdList);
    });
    this.#cmdList.addEventListener("change", ()=>{
      this.#cmdList.style.display = "none";

      const selection = window.getSelection();
      if (selection.rangeCount !== 1 || selection.baseOffset < 3) return;
      const range = selection.getRangeAt(0);
      console.warn("point here");
      // find AT
      let j = selection.baseOffset;
      for(;j>Math.max(selection.baseOffset-5, 0);j--)
      {
        if(range?.startContainer?.nodeValue[j] == 'T' && range?.startContainer?.nodeValue[j-1] == 'A') break;
      }
      const startsel = selection.baseOffset - j + 1;
      const subs = range?.startContainer?.nodeValue?.substring(selection.baseOffset-startsel, selection.baseOffset);
      if(subs.startsWith("AT"))
      {
        console.log(range);
        let newStr = range.startContainer.nodeValue.substring(0, selection.baseOffset);
        newStr += this.#cmdList.value.substring(startsel);
        newStr += range.startContainer.nodeValue.substring(selection.baseOffset);
        range.startContainer.nodeValue = newStr;
        this.#updateText();
      }
    });

    this.#paramList = _CN("select", {size:5, style:"position:absolute;left:0px;top:0px;display:none;width:200px;height:130px;font-size:12px;z-index:1001;"}, [], document.body);
  }

  #writeLetter(e)
  {
    // command list is open
    if(this.#cmdList.style.display == "block")
    {
      if(e?.data == " " || e.inputType == "insertLineBreak" || e.code == "Escape")
      {
        this.#cmdList.style.display = "none";
        return false;
      }
      else
      {
        const selection = window.getSelection();
        if (selection.rangeCount !== 1 || selection.baseOffset < 3) return;
        const range = selection.getRangeAt(0);
        console.warn("point here");
        // find AT
        let j = selection.baseOffset;
        for(;j>Math.max(selection.baseOffset-5, 0);j--)
        {
          if(range?.startContainer?.nodeValue[j] == 'T' && range?.startContainer?.nodeValue[j-1] == 'A') break;
        }
        const startsel = selection.baseOffset - j + 1;
        const subs = range?.startContainer?.nodeValue?.substring(selection.baseOffset-startsel, selection.baseOffset);
        if(!subs.startsWith("AT")) return;

        [...this.#cmdList.getElementsByTagName("option")].forEach(o=>{
          if(!o.value.startsWith(subs)) o.style.display="none";
          else o.style.display="";
        });
      }
    }
    else if(this.#paramList.style.display == "block")
    {
      if(e?.data == " " || e.inputType == "insertLineBreak" || e.code == "Escape")
      {
        this.#paramList.style.display = "none";
        return false;
      }
    }
    else if(e?.data == "T")
    {
      const selection = window.getSelection();
      if (selection.rangeCount !== 1 || selection.baseOffset < 1) return null;
      const range = selection.getRangeAt(0);
      if(range?.startContainer?.nodeValue?.substring(selection.baseOffset-2, selection.baseOffset) == "AT")
      {
        const rect = range.getClientRects()[0];
        if (rect)
        {
          this.#cmdList.style.left = (rect.left - 30) + "px";
          this.#cmdList.style.top = (rect.top + 20) + "px";
          this.#cmdList.style.display = "block";
          [...this.#cmdList.getElementsByTagName("option")].forEach(o=>{o.style.display="";});
        }
      }
    }
    else if(e?.data == ".")
    {
      const selection = window.getSelection();
      if (selection.rangeCount !== 1 || selection.baseOffset < 3) return;
      const range = selection.getRangeAt(0);
      // find AT
      let j = selection.baseOffset - 1;
      for(;j>Math.max(selection.baseOffset-8, 0);j--)
      {
        if(range?.startContainer?.nodeValue[j] == 'T' && range?.startContainer?.nodeValue[j-1] == 'A') break;
      }
      const startsel = selection.baseOffset - j + 1;
      const subs = range?.startContainer?.nodeValue?.substring(selection.baseOffset-startsel, selection.baseOffset-1);
      console.warn("FIND COMMAND...");
      if(!subs.startsWith("AT")) return;
      if(typeof ATs[subs] !== 'undefined')
      {
        console.log(ATs[subs]);

        const rect = range.getClientRects()[0];
        this.#paramList.style.left = (rect.left - 30) + "px";
        this.#paramList.style.top = (rect.top + 20) + "px";
        this.#paramList.style.display = "block";
        while(this.#paramList.childNodes.length > 0) this.#paramList.removeChild(this.#paramList.childNodes[0]);

        ATs[subs].GetParams().forEach(p=>{
          _CN("option", {value:p.GetName()}, [p.GetName() + " | " + p.GetDescription()], this.#paramList);
        });
      }
    }
    return true;
  }

  async #updateText(ts=-1)
  {
    if(ts > 0 && ts>this.#lastTimestamp) this.#lastTimestamp = ts;
    if(this.#updatingText) return;
    this.#updatingText = true;

    let strO = this.#frontDiv.textContent;
    strO = strO.replace(/(^(?!#)\bAT[+A-Z=?]*)/gm, "<span style='color:green;'>$1</span>");
    strO = strO.replace(/^(WAIT[ 0-9]*)/gm, "<span style='color:#66a;'>$1</span>");
    strO = strO.replace(/^(IF[A-Za-z0-9\. ]+=[ ]*[A-Za-z0-9\.]*)/gm, "<span style='color:#aa6;'>$1</span>");
    strO = strO.replace(/^(#.*?)$/gm, "<span style='color:#888;'>$1</span>");
    strO = strO.replace(/\n/gmi, " <br>");
    this.#backDiv.innerHTML = strO;

    this.#backDiv.scrollTo(0 , this.#frontDiv.scrollTop);
    this.#linesDiv.scrollTo(0 , this.#frontDiv.scrollTop);

    if(ts > 0 && this.#lastTimestamp > ts)
    {
      const newTS = this.#lastTimestamp;
      setTimeout(()=>{
        this.#updateText(newTS);
      }, 100);
      return;
    }
    this.#updatingText = false;
  }
  
  Init()
  {
    
  }

  Select()
  {

  }

  Execute()
  {
    let commands = this.#frontDiv.textContent.split("\n");
    this.#executingLine.style.opacity = 1;
    this.#executingLine.style.top = -this.#LINE + "px";
    this.#executingLine.style.background = "";

    this.#executeSingleCommand(commands);
  }

  #executeSingleCommand(cmds)
  {
    this.#executingLine.style.top = parseInt(this.#executingLine.style.top) + this.#LINE + "px";

    return new Promise((res, rej)=>{
      if(cmds.length <= 0) rej();
      const cmd = cmds.shift();
      
      let p = null;

      if(typeof ATs[cmd.replace(/=.*/g,'').replace(/\?.*/g,'').trim()] !== "undefined")
      {
        this.#setInfoLine(`Execute command: ${cmd}`);
        p = SIMSerial.Send(cmd, null);
      }
      else if(cmd.startsWith("WAIT "))
      {
        const seconds = parseInt(cmd.substring(5));
        this.#setInfoLine(`Sleep ${seconds} seconds`);
        p = new Promise((res)=>{
          setTimeout(()=>{res();}, seconds*1000);
        });
      }
      else if(cmd.length <= 1 || cmd.startsWith("#"))
      {
        this.#setInfoLine(`Jump to next command`);
        p = new Promise((res)=>{
          setTimeout(()=>{res();}, 1000);
        });
      }
      else
      {
        this.#setInfoLine(`Invalid command: ${cmd}!`, true);
        this.#executingLine.style.background = "red";
        console.error("Invalid cmd!", cmd);
        rej("Invalid cmd! " + cmd);
      }

      p.then(()=>{
        if(cmds.length <= 0)
        { 
          res();
        }
        else
        {
          this.#executeSingleCommand(cmds);
        }
      });
    });
  }

  #setInfoLine(text, isError)
  {
    setTimeout(()=>{this.#infoLine.style.transitionDuration = "2s";}, 50);
    this.#infoLine.style.opacity = 1.0;
    if(isError) this.#infoLine.style.backgroundColor = "#a33";
    this.#infoLine.textContent = text;
    if(this.#infoLineTimeout != null)
      clearTimeout(this.#infoLineTimeout);

    this.#infoLineTimeout = setTimeout(()=>{
      this.#infoLineTimeout = null;
      this.#infoLine.style.opacity = 0.2;
      this.#infoLine.style.backgroundColor = "";
      setTimeout(()=>{this.#infoLine.style.transitionDuration = "0.2s";}, 50);
    }, isError ? 5000 : 1000);
  }
};

Tabs.AddTab(new TabScript());