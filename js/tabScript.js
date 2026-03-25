class TabScript
{
  Title = "Scripts";

  #infoLine = null;
  #infoLineTimeout = null;
  #lastLineText = "";
  #isExecuting = false;
  
  constructor()
  {
    this.div = _CN("div", {class:"box tab tabscript"}, [_CN("h2", {}, ["Scripts"])], Tabs.GetDiv());

    setTimeout(()=>{
      let s = _CN("script", {src:"js/scripteditor.js"}, [], document.head);
      s.addEventListener("load", ()=>{this.#init();});
    }, 500);
  }

  #init()
  {
    let toolbar = _CN("div", {}, [], this.div);

    _CN("button", {class:"icon", title:"save current script"}, ["💾"],toolbar).addEventListener("click", ()=>{
      localStorage.setItem("gsm_script_file", ScriptEditor.GetText());
    });
    _CN("button", {class:"icon", title:"load saved script"}, ["📂"],toolbar).addEventListener("click", ()=>{
      ScriptEditor.SetText(localStorage.getItem("gsm_script_file", "AT"));
    });
    _CN("button", {class:"icon", title:"execute"}, ["⚡"],toolbar).addEventListener("click", ()=>{
      this.Execute();
    });
    _CN("i", {style:"padding-left:30px;"}, [" | Create scripts and automate the process"], toolbar);

    let divMain = _CN("div", {class:"tabscriptmain"}, [], this.div);
    ScriptEditor.SetWorkingDiv(divMain);

    this.#infoLine = _CN("div", {class:"tabscriptinfo"}, [], this.div);

    ScriptEditor.AddTextListener("AT", (range)=>{
      const sel = window.getSelection();
      console.log(sel);
      ScriptEditor.ShowList(range, Object.keys(ATs).sort((a,b)=>{return a.localeCompare(b)}), "AT");
    });

    ScriptEditor.AddTextListener(".", (range)=>{
      const text = range?.startContainer?.nodeValue;
      if(!text || !text.length) return;
      let startOffset = range.startOffset-1;
      while(text[startOffset] != ' ' && text[startOffset] != '\n' && startOffset>0) startOffset--;
      const subs = text.substring(startOffset+1, text.indexOf(".", startOffset));
      //if(!subs.startsWith("AT")) return;

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
      ScriptEditor.ShowList(range, getters, "");
    });

    window.addEventListener("serial", (data)=>{
      if(this.#isExecuting)
      {
        const nlc = (data.detail.answer.match(/\n/g) || []).length;
        if(nlc > 1)
          this.#lastLineText = data.detail.answer.substring(data.detail.answer.lastIndexOf("\n")+1).trim();
        else if(nlc > 0) 
          this.#lastLineText = data.detail.answer.substring(0, data.detail.answer.indexOf("\n")).trim();
        else 
          this.#lastLineText = data.detail.answer.trim();

        console.log("SCRIPT", data.detail);
      }
    });
  }
  
  Init()
  {
    
  }

  Select()
  {

  }

  Execute()
  {
    if(this.#isExecuting)
      return;

    let commands = ScriptEditor.GetText().split("\n");
    this.#lastLineText = "";
    ScriptEditor.ResetExecuting();
    this.#isExecuting = true;
    this.#executeSingleCommand(commands, []).then(()=>{
      this.#isExecuting = false;
      ScriptEditor.FinishExecuting(this.#lastLineText);
    }).catch((e)=>{
      this.#isExecuting = false;
      ScriptEditor.ErrorExecuting(e);
    });
  }

  #executeSingleCommand(cmds, ifs)
  {
    ScriptEditor.ExecuteNextLine(this.#lastLineText);

    return new Promise((res, rej)=>{
      if(cmds.length <= 0) rej();
      const cmd = cmds.shift().trim();
      
      let p = null;
      this.#lastLineText = "-";

      if(ifs.length > 0 && !ifs[ifs.length-1].execute)
      {// bypass command
        if(cmd.startsWith("END")) ifs.pop();
        this.#lastLineText = "skip";
        p = new Promise((res)=>{setTimeout(()=>{res();}, 20);});
      }
      else if(typeof ATs[cmd.replace(/=.*/g,'').replace(/\?.*/g,'').trim()] !== "undefined")
      {
        this.#lastLineText = "send XXX";
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
        this.#lastLineText = "end if #" + ifs.length;
        this.#setInfoLine(`END IF`);
        if(ifs.length > 0)
        {
          ifs.pop();
          p = new Promise((res)=>{setTimeout(()=>{res();}, 100);});
        }
        else
        {
          ScriptEditor.ErrorExecuting("END without IF");
          rej("END without an IF!"); return; 
        }
      }
      else if(cmd.startsWith("WAIT "))
      {
        this.#lastLineText = "wait";
        const seconds = parseInt(cmd.substring(5));
        this.#setInfoLine(`Sleep ${seconds} seconds`);
        p = new Promise((res)=>{
          setTimeout(()=>{res();}, seconds*1000);
        });
      }
      else if(cmd.length <= 1 || cmd.startsWith("#"))
      {
        this.#lastLineText = "skip";
        this.#setInfoLine(`Jump to next command`);
        p = new Promise((res)=>{
          setTimeout(()=>{res();}, 1000);
        });
      }
      else if(cmd.startsWith("IF"))
      {
        this.#setInfoLine(`IF (check)`);
        const regex = /IF[ ]*(AT[A-Z+]*).([A-Za-z0-9]*)[ ]*(!=|=|<|>)[ ]*(.*$)/gm;
        const m = regex.exec(cmd);
        console.log(m);
        if(m.length != 5)
        {
          ScriptEditor.ErrorExecuting("IF error");
          rej("IF parameters count is wrong"); return;
        }
        else if(typeof ATs[m[1]] === 'undefined')
        {
          ScriptEditor.ErrorExecuting("IF error");
          rej("IF > AT command not found: " + m[1]); return;
        }
        else if(typeof ATs[m[1]][m[2]] === 'undefined')
        {
          ScriptEditor.ErrorExecuting("IF error");
          rej("IF > AT parameter not found: " + m[2]); return;
        }
        else if(m[3] != '!=' && m[3] != '=' && m[3] != '<' && m[3] != '>')
        {
          ScriptEditor.ErrorExecuting("IF error");
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
            this.#lastLineText = "if #" + ifs.length + " (true)";
          }
          else
          {
            ifs.push({execute:false});
            this.#lastLineText = "if #" + ifs.length + " (false)";
          }
          
          p = new Promise((res)=>{
            setTimeout(()=>{res();}, 1000);
          });
        }
      }
      else
      {
        this.#setInfoLine(`Invalid command: ${cmd}!`, true);
        console.error("Invalid cmd!", cmd);
        rej("Invalid cmd: " + cmd); return;
      }

      p.then(()=>{
        if(cmds.length <= 0)
        { 
          res();
        }
        else
        {
          this.#executeSingleCommand(cmds, ifs).then(()=>{
            res();
          }).catch((e)=>{
            rej(e);
          });
        }
      }).catch((e)=>{
        rej(e);
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