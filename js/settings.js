let Settings = new class
{
  #basename = "gsm_";
  #group = [];
  #idle = false;
  constructor()
  {
    this.#group.push({name:"apn", info:"APN", options:[{name:"url", type:"url", info:"Url", value:""}]});
    this.#group.push({name:"coap", info:"COAP", options:[{name:"url", type:"url", info:"Url", value:""}]});
    this.#group.push({name:"ssl", info:"SSL Certificate", options:[{name:"cer", type:"text", info:"certificate", value:""}, {name:"name", type:"url", info:"Filename", value:""}]});
  }
  
  Init()
  {
    this.#group.forEach(g=>{
      g.options.forEach(o=>{
        let val = localStorage.getItem(this.#basename + g.name + "_" + o.name);
        if(val != null) o.value = val;
      });
    });
  }
  
  AutoSaveChanges(input)
  {
    if(!input.title)
    {
      console.error("no title for this imput", input);
      return;
    }
    const t = this.#basename + "_autosave_" + input.title;
    const v = localStorage.getItem(t);
    /*if(input?.tagName == "textarea")
    {
      if(v) input.textContent = v;
      input.addEventListener("change", ()=>{
        localStorage.setItem(t, input.textContent);
      });
    }
    else*/
    {
      if(v) input.value = v;
      input.addEventListener("change", ()=>{
        localStorage.setItem(t, input.value);

          // update current value
        this.#group.forEach(g=>{
          g.options.forEach(o=>{
            if(t == this.#basename + g.name + "_" + o.name) o.value = val;
          });
        });
      });
    }
  }
  
  GetGroupDiv(name, div)
  {
    let sdiv = _CN("div", {class:"settingsgroup"}, [], div);
    let group = null;
    this.#group.forEach(g=>{if(g.name==name)group=g;});
    if(group == null)
    {
      _CN("b", {}, ["Invalid group: " + name], sdiv);
      return sdiv;
    }
    _CN("h2", {}, [group.info + " settings"], sdiv);
    group.options.forEach(o=>{
      const cla = this.#basename + group.name + "_" + o.name;
      if(o.type=="url" || o.type=="string")
      {
        _CN("label", {}, [o.info + ": "], sdiv);
        let i = _CN("input", {type:"text", value:o.value, class:cla}, [], sdiv);
        i.addEventListener("change", ()=>{
          if(this.#idle) return;
          
          this.#idle = true;
          localStorage.setItem(cla, i.value);
          setTimeout(()=>{
            [...document.getElementsByClassName(cla)].forEach((oc)=>{
              oc.value = i.value;
            });
          }, 10);
          setTimeout(()=>{this.#idle = false;}, 200);
        });
      }
      else if(o.type=="text")
      {
        _CN("label", {}, [o.info + ": "], sdiv);
        let i = _CN("textarea", {class:cla, style:"width:80%", rows:4}, [o.value], sdiv);
        i.addEventListener("change", ()=>{
          if(this.#idle) return;
          
          this.#idle = true;
          localStorage.setItem(cla, i.value);
          setTimeout(()=>{
            [...document.getElementsByClassName(cla)].forEach((oc)=>{
              oc.value = i.value;
            });
          }, 10);
          setTimeout(()=>{this.#idle = false;}, 200);
        });
      }
    });
    
    return sdiv;
  }
  
  GetValue(p1, p2)
  {
    let ret = null;
    
    this.#group.forEach(g=>{
      if(g.name==p1)
      {
        g.options.forEach(o=>{
          if(o.name==p2)
          {
            ret = o.value;
          }
        });
      }
    });
    
    return ret;
  }
};

window.addEventListener("load", ()=>{
  setTimeout(()=>{
    Settings.Init();
  }, 1000);
});
