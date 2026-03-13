const ATEditor = new class
{
  constructor()
  {

  }

  ShowWrite(cmd)
  {
    let newParams = [];
    let paramIndex = 0;
    let bg = _CN("div", {class:"bgoverlay"}, [], document.body);
    let win = _CN("div", {class:"window", style:"padding:10px;min-width:300px;min-height:200px;background:linear-gradient(to bottom, #ee5, #bb8);text-align:center;"}, [], bg);
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
        else if(par.GetType() == "integer")
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
        }
        inp.addEventListener("change", ()=>{newParams[paramIndex] = inp.value;});
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
      _CN("table", {style:"height:100px;width:100%;vertical-align:middle;"}, [_CN("tr", null, [_CN("td", null, [butt1]), _CN("td", null, [butt2])])], win);
    });
  }
};