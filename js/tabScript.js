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
      if(e.code == "Escape" || e.code == "ArrowUp" || e.code == "ArrowDown")
      {
        let ret = this.#writeLetter(e);
        if(!ret) {e.stopPropagation(); e.preventDefault();}
        e.cancel = true;
        return ret;
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
      else if(e.code == "ArrowDown")
      {
        let found = false;
        let exec = false;
        [...this.#cmdList.options].forEach(o=>{
          if(!found && o.selected) found = true;
          else if(!exec && found && o.style.display != "none") {exec=true;o.selected=true;}
        });
        return false;
      }
      else if(e.code == "ArrowUp")
      {
        let found = false;
        let lasto = null;
        [...this.#cmdList.options].forEach(o=>{
          if(!found && o.selected) {found = true; lasto.selected=true;}
          else if(!found && o.style.display != "none") {lasto = o;}
        });
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

        let first = false;
        [...this.#cmdList.getElementsByTagName("option")].forEach(o=>{
          if(!o.value.startsWith(subs)) o.style.display="none";
          else {
            o.style.display="";
            if(first) {first = false; o.selected=true;}
          }
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
      else if(e.code == "ArrowDown")
      {
        let found = false;
        let exec = false;
        [...this.#paramList.options].forEach(o=>{
          if(!found && o.selected) found = true;
          else if(!exec && found && o.style.display != "none") {exec=true;o.selected=true;}
        });
        return false;
      }
      else if(e.code == "ArrowUp")
      {
        let found = false;
        let lasto = null;
        [...this.#paramList.options].forEach(o=>{
          if(!found && o.selected) {found = true; lasto.selected=true;}
          else if(!found && o.style.display != "none") {lasto = o;}
        });
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
      
      if(!subs.startsWith("AT")) return;
      if(typeof ATs[subs] !== 'undefined')
      {
        console.log(ATs[subs]);

        const rect = range.getClientRects()[0];
        this.#paramList.style.left = (rect.left - 30) + "px";
        this.#paramList.style.top = (rect.top + 20) + "px";
        this.#paramList.style.display = "block";
        while(this.#paramList.childNodes.length > 0) this.#paramList.removeChild(this.#paramList.childNodes[0]);
        
        console.warn("FIND COMMAND...");

        //const allGetterKeys = Object.entries(Object.getOwnPropertyDescriptors(ATs[subs].constructor)).filter(([key, descriptor]) => typeof descriptor.get === 'function').map(([key]) => key);
        let getters = [];
        let proto = Object.getPrototypeOf(ATs[subs]);
        while (proto && proto !== Object.prototype) {
            const descriptors = Object.getOwnPropertyDescriptors(proto);

            for (const [name, desc] of Object.entries(descriptors)) {
                if (typeof desc.get === "function") {
                    getters.push(name);
                }
            }

            proto = Object.getPrototypeOf(proto);
        }

        getters.forEach(p=>{
          _CN("option", {value:p}, [p], this.#paramList);
        });
        this.#paramList.options[0].selected = true;
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
    strO = strO.replace(/^(IF[A-Za-z0-9\. \+]+=[ ]*[A-Za-z0-9\.]*)/gm, "<span style='color:#aa6;'>$1</span>");
    strO = strO.replace(/^(END)/gm, "<span style='color:#aa6;'>$1</span>");
    strO = strO.replace(/(^(?!#)\bAT[+A-Z=?]*)/gm, "<span style='color:green;'>$1</span>");
    strO = strO.replace(/^(WAIT[ 0-9]*)/gm, "<span style='color:#66a;'>$1</span>");
    strO = strO.replace(/^(DATA .*$)/gm, "<span style='color:#543;'>$1</span>");
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

    this.#executeSingleCommand(commands, []);
  }

  #executeSingleCommand(cmds, ifs)
  {
    this.#executingLine.style.top = parseInt(this.#executingLine.style.top) + this.#LINE + "px";

    return new Promise((res, rej)=>{
      if(cmds.length <= 0) rej();
      const cmd = cmds.shift();
      
      let p = null;

      if(ifs.length > 0 && !ifs[ifs.length-1].execute)
      {// bypass command
        if(cmd.startsWith("END")) ifs.pop();
        p = new Promise((res)=>{setTimeout(()=>{res();}, 20);});
      }
      else if(typeof ATs[cmd.replace(/=.*/g,'').replace(/\?.*/g,'').trim()] !== "undefined")
      {
        this.#setInfoLine(`Execute command: ${cmd}`);
        p = SIMSerial.Send(cmd, null);
      }
      else if(cmd.startsWith("DATA "))
      {
        this.#setInfoLine(`Prepare data: ` + cmd.substring(5));
        p = new Promise((res)=>{setTimeout(()=>{res();}, 20);});
        setTimeout(()=>{
          SIMSerial.SendData(cmd.substring(5));
        }, 1000);
      }
      else if(cmd.startsWith("END"))
      {
        this.#setInfoLine(`END IF`);
        if(ifs.length > 0)
        {
          ifs.pop();
          p = new Promise((res)=>{setTimeout(()=>{res();}, 100);});
        }
        else
        {
          rej("END without an IF!"); return; 
        }
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
      else if(cmd.startsWith("IF"))
      {
        this.#setInfoLine(`IF (check)`);
        const regex = /IF[ ]*(AT[A-Z+]*).([A-Z0-9]*)[ ]*(!=|=|<|>)[ ]*(.*$)/gm;
        const m = regex.exec(cmd);
        console.log(m);
        if(m.length != 5)
        {
          rej("IF parameters count is wrong"); return;
        }
        else if(typeof ATs[m[1]] === 'undefined')
        {
          rej("IF > AT command not found: " + m[1]); return;
        }
        else if(typeof ATs[m[1]][m[2]] === 'undefined')
        {
          rej("IF > AT parameter not found: " + m[2]); return;
        }
        else if(m[3] != '!=' && m[3] != '=' && m[3] != '<' && m[3] != '>')
        {
          rej("IF > allowed are '=', '!=', '<' or '>' not " + m[3]); return;
        }
        else
        {
          const val1 = ATs[m[1]][m[2]];
          let val2 = m[4].trim();
          let isString = false;
          if(val2.startsWith('"')) {val2 = val2.substring(1, val2.length-1); isString=true;}
          let success = false;
          switch(m[3])
          {
            case '=': if(val1 == val2) success = true; break;
            case '!=': if(val1 != val2) success = true; break;
            case '<': if(val1 < val2) success = true; break;
            case '>': if(val1 > val2) success = true; break;
          }
          if(success)
          {
            ifs.push({execute:true});
          }
          else
          {
            ifs.push({execute:false});
          }
          p = new Promise((res)=>{
            setTimeout(()=>{res();}, 1000);
          });
        }
      }
      else
      {
        this.#setInfoLine(`Invalid command: ${cmd}!`, true);
        this.#executingLine.style.background = "red";
        console.error("Invalid cmd!", cmd);
        rej("Invalid cmd! " + cmd); return;
      }

      p.then(()=>{
        if(cmds.length <= 0)
        { 
          res();
        }
        else
        {
          this.#executeSingleCommand(cmds, ifs);
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