const Tabs = new class
{
  #tabs = [];
  #div;
  #tabManual = null;
  
  constructor()
  {
    
  }
  
  Load()
  {
    this.#div = _CN("div", {class:"box tabs", style:"border-style:none;background:transparent;"}, [], document.body);
    
    let scripts = [
      {name:"tabModule", title: "Module Info"}, 
      {name:"tabCommands", title: "Commands"}, 
      {name:"tabCoap", title: "COAP"},
      {name:"tabHttps", title: "HTTPs"},
      {name:"tabSms", title: "SMS"},
      {name:"tabManual", title: "Manual"}
    ];
    
    let left = 2;
    let top = 0;
    const tabW = 9.5;
    const tabT = 4.5;
    scripts.forEach(scr=>{
      let s = _CN("script", {src:"js/" + scr.name + ".js?v=55" + parseInt(new Date().getTime() / 5000)}, [], document.head);
    });
    
    setTimeout(()=>{
      for(let j=0;j<scripts.length;j++)
      {
        let sl = left;
        let st = tabT - top * 2;
        left += 9.7;
        if(left > 40)
        {
          top ++;
          left = 2 + (top%2) * (tabW*0.5);
        }
        let tab = null;
        switch(j)
        {
          case 0: tab = new TabModule(this.#div); break;
          case 1: tab = new TabCommands(this.#div); break;
          case 2: tab = new TabCoap(this.#div); break;
          case 3: tab = new TabHttps(this.#div); break;
          case 4: tab = new TabSms(this.#div); break;
          case 5: tab = new TabManual(this.#div); this.#tabManual = j; break;
          default: console.error("Tab " + j + " not available!"); break;
        }
        let sel = _CN("div", {class:"tabselect"}, [scripts[j].title], this.#div);
        sel.style.left = sl + "vw";
        sel.style.top = st + "vh";
        sel.style.zIndex = 50 - j;
        this.#tabs.push({sel: sel, tab: tab});
        
        if(j == 0)
        {
          sel.style.background = "#eff";
        }
        else
        {
          tab.div.style.display = "none";
        }
        
        sel.addEventListener("click", ()=>{
          this.#SelectTab(j);
        });
      }
    }, 500);
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
    let title = text;
    if(cmdObj) 
    {
      title = cmdObj.GetDescription();
      title += " [" + cmdObj?.GetCmd() + "]";
    }
    let butt = _CN("button", {}, ["?"]);
    let div = _CN("div", {class:"singlecmd", title:title}, [_CN("span", {}, [text]), butt]);
    butt.addEventListener("click", ()=>{
      cmd();
    });
    
    return div;
  }
};