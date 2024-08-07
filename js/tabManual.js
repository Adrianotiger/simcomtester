class TabManual
{
  Title = "Manual";
  
  constructor()
  {
    this.div = _CN("div", {class:"box tab manual"}, [_CN("h2", {}, ["Manual"])], Tabs.GetDiv());
        
    _CN("p", {}, ["Press on 📃 to get more info about the command."], this.div);
    
    this.manual = _CN("div", {class:"manual"}, [], this.div);
    
    window.addEventListener("manual", (data)=>{
      Tabs.OpenManualTab();
      this.OpenTutorial(data.detail);
    });
  }
  
  Init()
  {
    
  }
  
  OpenTutorial(cmd)
  {
    this.manual.innerHTML = "";
    let manualDiv = _CN("div" ,{style:"opacity:0.4;transition:all 0.3s;"}, ["loading manual..."], this.manual);
    
    _CN("h1", {}, [cmd.GetCmd()], this.manual);
    
    let timeout = "-";
    if(cmd.GetTimeout() > 1000)
    {
      timeout = (cmd.GetTimeout() / 1000) + "s";
    }
    setTimeout(()=>{
      let ch = PDFManual.GetChapter(cmd.GetDoc());
      if(ch)
      {
        manualDiv.textContent = "";
        _CN("span", {style:"cursor:pointer;color:#700;"}, [_CN("img", {src:"./modules/pdf.png", style:"height:18px;vertical-align:middle;"}), " View on SimCom manual"], manualDiv).addEventListener("click", ()=>{
          PDFManual.OpenChapter(ch);
        });
        _CN("span", {style:"padding:0px 10px;"}, [" - "], manualDiv);
        _CN("span", {style:"cursor:pointer;color:#700;"}, [_CN("img", {src:"./modules/pdf.png", style:"height:18px;vertical-align:middle;"}), " Open on new page"], manualDiv).addEventListener("click", ()=>{
          PDFManual.GetChapterPage(ch, (p)=>{
            window.open(PDFManual.pdfFile + "#page=" + p, "new");
          });
        });
        manualDiv.style.opacity = 1;
      }
      else
      {
        manualDiv.textContent = "No SimCom manual found.";
      }
    }, 100)

    _CN("p", {}, [cmd.GetDescription()], this.manual);
        
    _CN("table", {border:1}, [
      _CN("tr", {}, [
        _CN("th", {}, ["Test"]),
        _CN("th", {}, ["Read"]),
        _CN("th", {}, ["Write"]),
        _CN("th", {}, ["Execute"]),
        _CN("th", {}, ["Timeout"])
      ]),
      _CN("tr", {}, [
        _CN("td", {}, [cmd.CanTest()?"✔️":"❌"]),
        _CN("td", {}, [cmd.CanRead()?"✔️":"❌"]),
        _CN("td", {}, [cmd.CanWrite()?"✔️":"❌"]),
        _CN("td", {}, [cmd.CanExecute()?"✔️":"❌"]),
        _CN("td", {}, [timeout])
      ])
    ], this.manual);
        
    const atp = cmd.GetAllParams();
    
    console.log(atp);
    for(let j=0;j<4;j++)
    {
      let o = {txt: "", can:false, arr:[], arr2:[], cmd:cmd.GetCmd(), func:null};
      switch(j)
      {
        case 0: o.txt = "Test"; o.can = cmd.CanTest(); o.arr = atp.test; o.cmd += "=? "; 
                o.func = ()=>{cmd.Test();};
                break;
        case 1: o.txt = "Read"; o.can = cmd.CanRead(); o.arr = atp.read; o.cmd += "? "; 
                o.func = ()=>{cmd.Read();};
                break;
        case 2: o.txt = "Write"; o.can = cmd.CanWrite(); o.arr = atp.write.get; o.arr2 = atp.write.set; o.cmd += "= "; break;
                o.func = ()=>{cmd.Write();};
        case 3: o.txt = "Execute"; o.can = cmd.CanExecute(); o.arr = atp.exe; o.cmd += " "; 
                o.func = ()=>{cmd.Execute();};
                break;
      }
      if(o.can)
      {
        let div = _CN("div", {style:"text-align:left;"}, [_CN("h2", {}, [o.txt])], this.manual);
        if(Array.isArray(o.arr) && o.arr.length > 0 || j == 2)
        {
          o.arr2.forEach(px=>{
            let st = o.cmd;
            let first = true;
            Object.keys(px).forEach(k=>{
              if(first) first = false;
              else st += ",";
              st += k;
            });
            st += " ➡️ (ANSWER)";
            let divP = _CN("div", {style:"text-align:left;cursor:pointer;"}, [st], div);
            divP.addEventListener("click", o.func);
          });
          
          o.arr.forEach(px=>{
            let st = o.cmd + " ➡️ ";
            let first = true;
            Object.keys(px).forEach(k=>{
              if(first) first = false;
              else st += ", ";
              st += k;
              if(px[k] != null) st += "=" + px[k];
            });
            let divP = _CN("div", {style:"text-align:left;cursor:pointer;"}, [st], div);
            divP.addEventListener("click", o.func);
          });
        }
        else
        {
          let st = o.cmd + " ➡️ ";
          let divP = _CN("div", {style:"text-align:left;cursor:pointer;"}, [st], div);
          divP.addEventListener("click", o.func);
        }
      }
    }
    
    let divP = _CN("div", {style:"text-align:left;"}, [_CN("h2", {}, ["Parameters"])], this.manual);
    atp.all.forEach(py=>{
      let div2 = _CN("div", {style:"display:block;padding-left:2vw;"});
      
      if(Array.isArray(py?.GetType()))
      {
        py.GetType().forEach(ptx=>{
          _CN("b", {style:"display:inline-block;min-width:4vw;text-align:center;float:left;"}, [ptx.GetValue()], div2);
          _CN("i", {style:"margin-left:1vw;display:inline-block;"}, [ptx.GetDescription()], div2);
          _CN("br", {}, [], div2);
        });
      }
      else
      {
        _CN("b", {style:"display:inline-block;min-width:4vw;text-align:center;float:left;"}, [py.GetType()], div2);
        _CN("i", {style:"margin-left:2vw;display:inline-block;"}, [py.GetDescription()], div2);
      }
      _CN("div", {style:"margin:0.5vh;padding:1vw;width:94%;box-shadow:0px 0px 0.6vh 1px #006;border-radius:1vh;"}, [_CN("label", {}, [py?.GetName()]), div2], divP);
    });
    
  }
  
  Select()
  {
    
  }
  
}

Tabs.AddTab(new TabManual());