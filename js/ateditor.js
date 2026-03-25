const ATEditor = new class
{
  constructor()
  {

  }

  ShowWrite(cmd)
  {
    let newParams = [];
    let bg = _CN("div", {class:"bgoverlay"}, [], document.body);
    let win = _CN("div", {class:"window box", style:"padding:10px;min-width:400px;width:fit-content;max-width:80vw;height:fit-content;max-height:80vh;text-align:center;"}, [], bg);
    let cmdText = null;
    console.log(cmd);

    const params = cmd.GetAllParams();
    console.log(params);

    _CN("h2", {}, [cmd.GetCmd()], win);
    _CN("p", {}, [cmd.GetDescription(), _CN("hr")], win);

    if(params.write.set.length > 1)
    {
      let sel = _CN("select", {}, [], win);
      params.write.set.forEach((wp, j)=> {
        _CN("option", {value:j}, [Object.keys(wp).join(", ")], sel);
      });
      sel.addEventListener("change", ()=>{fFill(sel.value);});
    }

    let divInps = _CN("div", {}, [], win);

    const fFill = (paramIndex)=>{
      let wp = params.write.set[paramIndex];
      divInps.innerHTML = "";
      console.log(wp);
      newParams = [];
      Object.keys(wp).forEach((wpk, j)=>{
        newParams.push("");
        const paramIndex = j;
        let par = cmd.GetParam(wpk);
        _CN("div", {style:"text-align:left;"}, [par.GetDescription()], divInps);
        let inp = null;
        if(Array.isArray(par.GetType()))
        {
          inp = _CN("select", {}, [_CN("option", {value:""}, ["-select-"])]);
          par.GetPossibleValues().forEach(av=>{
            _CN("option", {value:av.v}, [`[${av.v}] ${av.d}`], inp);
          });
        }
        else if(par.GetType() == "number")
        {
            inp = _CN("input", {type:"number"}, []);
        }
        else if(par.GetType() == "string")
        {
            inp = _CN("input", {type:"text"}, []);
        }
        else
        {
          inp = _CN("b", {}, ["Unknown type"]);
          console.error("Unknown type for parameter:", wpk);
        }
        inp.addEventListener("change", ()=>{
          newParams[paramIndex] = inp.value;
          cmdText.textContent = cmd.GetCmd() + "=" + newParams.join(",");
        });
        _CN("div", {style:"text-align:right;"}, [inp], divInps);
        console.log(wpk, par);
      });
    }
    fFill(0);
    
    return new Promise((res, rej)=>{
      win.addEventListener("click", (e)=>{
        e.stopPropagation();
      });

      bg.addEventListener("click", ()=>{
        document.body.removeChild(bg);
        rej();
      });

      let butt1 = _CN("button", {style:"padding:5px;"}, ["Send"]);
      butt1.addEventListener("click", ()=>{
        document.body.removeChild(bg);
        res(newParams);
      });
      let butt2 = _CN("button", {style:"padding:5px;"}, ["Cancel"]);
      butt2.addEventListener("click", ()=>{
        document.body.removeChild(bg);
        rej();
      });
      _CN("table", {style:"height:70px;width:100%;vertical-align:middle;"}, [_CN("tr", null, [_CN("td", null, [butt1]), _CN("td", null, [butt2])])], win);
      cmdText = _CN("i", {}, [cmd.GetCmd() + "="], win);
      const copyButt = _CN("b", {style:"float:right;cursor:pointer;"}, ["📋"], win);

      copyButt.addEventListener("click", ()=>{
        copyButt.textContent = "copied!";
        setTimeout(()=>{copyButt.textContent = "📋";}, 500);
        const type = "text/plain";
        const clipboardItemData = {
          [type]: cmdText.textContent,
        };
        const clipboardItem = new ClipboardItem(clipboardItemData);
        navigator.clipboard.write([clipboardItem]);
      });
    });
  }

  FindCommand(destInput, executeCommand=false)
  {
    let bg = _CN("div", {class:"bgoverlay"}, [], document.body);
    let win = _CN("div", {class:"window box", style:"padding:10px;min-width:400px;width:fit-content;max-width:80vw;height:fit-content;max-height:80vh;text-align:center;"}, [], bg);

    const filters = [{c:2.2, t:"AT base"}, {c:3.2, t:"3GPP"}, {c:4.2, t:"SMS"}, {c:5.2, t:"SimCom specific"}, {c:6.2, t:"GPRS"}, {c:7.2, t:"IP"}, {c:8.2, t:"GPS"}, {c:9.2, t:"File"}, {c:10.2, t:"Toolkit"}, {c:11.2, t:"SSL"}, {c:12.2, t:"TCP/UDP"}, {c:13.2, t:"HTTP(S)"}, {c:14.2, t:"PING"}, {c:15.2, t:"FTP(S)"}, {c:16.2, t:"NTP"}, {c:17.2, t:"MQTT"}, {c:18.2, t:"COAP"}, {c:19.2, t:"DNS"}, {c:20.2, t:"LBS"}, {c:21.2, t:"Email"}];
    let sel = _CN("select", {size:10,multiline:10,style:"min-width:100px;"});

    filters.forEach(f=>{
      f.i = _CN("input", {type:"checkbox", checked:true});
      _CN("span", {style:"padding:0px 5px;min-width:60px;display:inline-block;"}, [f.i, " ", f.t, " | "], win);
      f.i.addEventListener("click", ()=>{
        this.#updateList(sel, filters);
      });
    });
    const obji2 = _CN("input", {type:"checkbox", checked:true});
    _CN("span", {style:"display:block;"}, [obji2, "ALL "], win);
    obji2.addEventListener("change", ()=>{
      filters.forEach(f=>{f.i.checked = obji2.checked});
      this.#updateList(sel, filters);
    });
    
    Object.keys(ATs).sort((a,b)=>{return a.localeCompare(b)}).forEach(atk=>{
      _CN("option", {value:atk}, [atk], sel);
    });

    let atdesc = _CN("div", {style:"display:inline-block;width:100%;"});
    _CN("table", {style:"width:100%;"}, [_CN("tr", {}, [
      _CN("td", null, [sel]),
      _CN("td", {style:"width:80%;"}, [atdesc])
    ])], win);

    win.addEventListener("click", (e)=>{
      e.stopPropagation();
    });

    bg.addEventListener("click", ()=>{
      document.body.removeChild(bg);
    });

    sel.addEventListener("change", ()=>{
      const at = ATs[sel.value];
      atdesc.textContent = "";
      _CN("h2", null, [at.GetCmd()], atdesc);
      _CN("hr", null, null, atdesc);
      _CN("p", null, [at.GetDescription()], atdesc);
      let doc = _CN("a", {href:"javascript:;"}, [at.GetDoc()]);
      doc.addEventListener("click", ()=>{
        const event = new CustomEvent("manual", { detail: at });
        window.dispatchEvent(event);
      });
      _CN("div", null, ["Doc: ", doc], atdesc);
      const t = _CN("table", {style:"margin:0 auto;width:200px;"}, [], atdesc);
      let tr = _CN("tr", null, [_CN("td", null, ["Test"])], t);
      _CN("td", null, [at.CanTest() ? "✅" : "❌"], tr);
      if(at.CanTest()) {
        _CN("td", {}, [_CN("button", null, ["❓"])], tr).addEventListener("click",()=>{
          document.body.removeChild(bg);
          destInput.value = at.GetCmd() + "=?";
          if(executeCommand) at.Test();
        });
      }
      tr = _CN("tr", null, [_CN("td", null, ["Exe"])], t);
      _CN("td", null, [at.CanExecute() ? "✅" : "❌"], tr);
      if(at.CanExecute()) {
        _CN("td", {}, [_CN("button", null, ["⚡"])], tr).addEventListener("click",()=>{
          document.body.removeChild(bg);
          destInput.value = at.GetCmd();
          if(executeCommand) at.Execute();
        });
      }
      tr = _CN("tr", null, [_CN("td", null, ["Read"])], t);
      _CN("td", null, [at.CanRead() ? "✅" : "❌"], tr);
      if(at.CanRead()) {
        _CN("td", {}, [_CN("button", null, ["📖"])], tr).addEventListener("click",()=>{
          document.body.removeChild(bg);
          destInput.value = at.GetCmd() + "?";
          if(executeCommand) at.Read();
        });
      }
      tr = _CN("tr", null, [_CN("td", null, ["Write"])], t);
      _CN("td", null, [at.CanWrite() ? "✅" : "❌"], tr);
      console.log(at);
      if(at.CanWrite()) {
        _CN("td", {}, [_CN("button", null, ["✍"])], tr).addEventListener("click",()=>{
          document.body.removeChild(bg);
          this.ShowWrite(at).then(params=>{
            destInput.value = at.GetCmd() + "=" + params.join(",");
            if(executeCommand) at.Write(params);
          }).catch(e=>{
            console.log(e);
          });
        });
      }
    });
  }

  #updateList(select, inputs)
  {
    let available = [];
    inputs.forEach(i=>{
      if(i.i.checked) available[parseInt(i.c * 10)] = true;
    });
    select.textContent = "";

    Object.keys(ATs).sort((a,b)=>{return a.localeCompare(b)}).forEach(atk=>{
      const doc = ATs[atk].GetDoc();
      const doci = parseInt(doc.substring(0, doc.indexOf(".", 3)) * 10);
      if(available[doci])
      {
        _CN("option", {value:atk}, [atk], select);
      }
    });
  }

};