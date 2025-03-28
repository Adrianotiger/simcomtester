const Tabs = new class
{
  #tabs = [];
  #div;
  #tabManual = null;
  #tabPos = {left:2, top:4.5, W:9.5, T:0, offsetX:9.7, offsetY:-2.5, zIndex:100};
  
  constructor()
  {
    window.addEventListener("serialactive", (data)=>{
      if(!this.#div) return;

      if(data.detail)
      {
        this.#div.style.pointerEvents = "inherit";
        this.#div.style.opacity = 1.0;
      }
      else
      {
        this.#div.style.pointerEvents = "none";
        this.#div.style.opacity = 0.5;
      }
    });
  }

  GetDiv()
  {
    return this.#div;
  }
  
  Load()
  {
    this.#div = _CN("div", {class:"box tabs", style:"border-style:none;background:transparent;"}, [], document.body);
    
    let scripts = [
      {name:"tabModule"}, 
      {name:"tabCommands"}, 
      {name:"tabSim"}, 
      {name:"tabCoap"},
      {name:"tabHttps"},
      {name:"tabTcpUdp"},
      {name:"tabSms"},
      {name:"tabGnss"},
      {name:"tabManual"}
    ];

    this.#tabManual = scripts.length - 1;
    
    let scriptsTotLoaded = 0;
    let scriptsLoading = false;
    let scriptLoading = setInterval(()=>{
      if(!scriptsLoading)
      {
        scriptsLoading = true;
        let s = _CN("script", {src:"js/" + scripts[scriptsTotLoaded].name + ".js?v=55" + parseInt(new Date().getTime() / 5000)}, [], document.head);
        s.addEventListener("load", ()=>{
          scriptsLoading = false;
          if(++scriptsTotLoaded >= scripts.length) clearInterval(scriptLoading);
        })
      }
    }, 100);
  }

  AddTab(tabClass)
  {
    //#tabPos = {left:2, top:4.5, W:9.5, T:0, offsetX:9.7, offsetY:-2, zIndex:100};
    
    let sel = _CN("div", {class:"tabselect"}, [tabClass.Title], this.#div);
    sel.style.left = this.#tabPos.left + "vw";
    sel.style.top = this.#tabPos.top + "vh";
    sel.style.zIndex = this.#tabPos.zIndex;

    this.#tabs.push({sel: sel, tab: tabClass});

    const j = 100 - this.#tabPos.zIndex;
    this.#tabPos.left += this.#tabPos.offsetX;
    this.#tabPos.zIndex--;
    if(this.#tabPos.left > 34)
    {
      this.#tabPos.T++;
      this.#tabPos.left = 2 + (this.#tabPos.T % 2) * (this.#tabPos.W * 0.5);
      this.#tabPos.top += this.#tabPos.offsetY;
    }
    
    if(j == 0)
    {
      sel.style.background = "#eff";
    }
    else
    {
      tabClass.div.style.display = "none";
    }
    
    sel.addEventListener("click", ()=>{
      this.#SelectTab(j);
    });
  }
  
  OpenManualTab()
  {
    this.#SelectTab(this.#tabManual);
  }
  
  #SelectTab(index)
  {
    this.#tabs.forEach((t)=>{
      t.sel.style.background = null;
      t.tab.div.style.display = "none";
    });
    
    this.#tabs[index].sel.style.background = "#eff";
    this.#tabs[index].tab.div.style.display = "block";
    
    this.#tabs[index].tab.Select();
  }
  
  AddCmd(text, cmd, cmdObj)
  {
    let title = text.replace(/\s*\(.*\)/g, "");
    if(cmdObj) 
    {
      title = cmdObj.GetDescription();
      title += " [" + cmdObj?.GetCmd() + "]";
    }
    const regex = /\s*\(.*\)/g;
    const found = text.match(regex);
    
    let butt = _CN("button", {}, ["?"]);
    let div = _CN("div", {class:"singlecmd", title:title}, [_CN("span", {}, [text.replace(/\([.]*\)/g, ""), found?_CN("sup",{}, [found[0]]):""]), butt]);
    butt.addEventListener("click", ()=>{
      cmd();
    });
    
    return div;
  }

};
