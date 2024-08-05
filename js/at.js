class ATEnum
{
  #val = 0;
  #description = "";
  constructor(val, description)
  {
    this.#val = val;
    this.#description = description;
  }
  
  GetValue()
  {
    return this.#val;
  }
  GetDescription()
  {
    return this.#description;
  }
}

class ATParam
{
  #name = "";
  #type = "unknown";
  #description = "";
  constructor(name, type, description)
  {
    this.#name = name;
    this.#type = type;
    this.#description = description;
  }
  
  GetName()
  {
    return this.#name;
  }
  
  GetType()
  {
    return this.#type;
  }
  
  GetPossibleValues()
  {
    let ret = [];
    if(Array.isArray(this.#type))
    {
      this.#type.forEach(t=>{
        ret.push({v:t.GetValue(), d:t.GetDescription()});
      });
    }
    return ret;
  }
  
  GetValue(index)
  {
    let ret = null;
    
    if(Array.isArray(this.#type))
    {
      this.#type.forEach(t=>{
        if(index == t.GetValue())
        {
          ret = t;
        }
      });
    }
    return ret;
  }
  
  GetDescription()
  {
    return this.#description;
  }
}

class ATBase
{
  #read = false;
  #write = false;
  #exe = false;
  #test = false;
  #description = "NO DESCRIPTION";
  #doc = "";
  #example = "+AT";
  #cmd = "AT";
  #timeout = 1000;
  #answer = "";
  #promise = null;
  #promiseRes = null;
  #promiseRej = null;
  #lines = [];
  #params = [];
  #readParams = [];
  #writeParams = [];
  #sendParams = [];
  #exeParams = [];
  #testParams = [];
  #requestType = "";
  #answerValue = {};
  #answerRaw = "";
  value = "";
  
  constructor(options)
  {
    this.#read = options.read??false;
    this.#write = options.write??false;
    this.#exe = options.exe??false;
    this.#test = options.test??false;
    this.#description = options.description??"NO DESCRIPTION";
    this.#example = options.example??"";
    this.#cmd = options.cmd??"INVALID_AT";
    this.#timeout = options.timeout??1000;
    this.#doc = options.doc??"0";
    
    ATs[this.#cmd] = this;
    
    this.value = "";
  }
  
  HoldUp(str)
  {
    return false;
  }
    
  
  AddParam(name, type, description)
  {
    this.#params.push(new ATParam(name, type, description));
  }
  
  AddReadAnswerParam(paramList)
  {
    this.#readParams.push(paramList);
  }
  
  AddWriteAnswerParam(paramList)
  {
    this.#writeParams.push(paramList);
  }
  
  AddTestAnswerParam(paramList)
  {
    this.#testParams.push(paramList);
  }
  
  AddWriteSendParam(paramList)
  {
    this.#sendParams.push(paramList);
  }
  
  AddExeAnswerParam(paramList)
  {
    this.#exeParams.push(paramList);
  }
  
  GetCmd()
  {
    return this.#cmd;
  }
  
  GetValue()
  {
    return this.#answerValue;
  }
  
  GetRawValue()
  {
    return this.#answerRaw;
  }

  GetDoc()
  {
    return this.#doc;
  }
  
  CanTest()
  {
    return this.#test;
  }
  CanRead()
  {
    return this.#read;
  }
  CanWrite()
  {
    return this.#write;
  }
  CanExecute()
  {
    return this.#exe;
  }
  
  GetDescription()
  {
    return this.#description;
  }
  
  GetTimeout()
  {
    return this.#timeout;
  }
  
  GetParams()
  {
    return this.#params;
  }
  
  GetAllParams()
  {
    let o = {
      all: this.#params,
      test: this.#testParams,
      read: this.#readParams,
      write: {set: this.#sendParams, get: this.#writeParams},
      exe: this.#exeParams
    };
    return o;
  }
  
  GetParam(name)
  {
    let ret = null;
    this.#params.forEach(p=>{
      if(p.GetName() == name) ret = p;
    });
    return ret;
  }
  
  Execute()
  {
    if(!this.#exe)
    {
      console.error("NO EXECUTION AVAILABLE FOR COMMAND " + this.#cmd);
      return;
    }
    this.#requestType = "exe";
    this.#lines = [];
    this.#answer = "";
    this.#promise = new Promise((resolve, reject)=>{
      
      this.#promiseRes = resolve;
      this.#promiseRej = reject;
    });
    SIMSerial.Send(this.#cmd + "\r\n", this);

    setTimeout(()=>{
      if(this.#answer == "" && this.#promise != null)
      {
        this.#promiseRej();
        this.#promise = null;
      }
    }, this.#timeout + 1000);

    return this.#promise;
  }
  
  Read()
  {
    if(!this.#read)
    {
      console.error("NO READ AVAILABLE FOR COMMAND " + this.#cmd);
      return;
    }
    this.#requestType = "read";
    this.#lines = [];
    this.#answer = "";
    this.#promise = new Promise((resolve, reject)=>{
      
      this.#promiseRes = resolve;
      this.#promiseRej = reject;
    });
    SIMSerial.Send(this.#cmd + "?\r\n", this);
    return this.#promise;
  }
  
  Write(values)
  {
    if(!this.#write)
    {
      console.error("NO WRITE AVAILABLE FOR COMMAND " + this.#cmd);
      return;
    }
    
    if(this.#sendParams.length == 0)
    {
      if(values.length > 0)
      {
        console.error("NO PARAMS EXPECTED FOR " + this.#cmd);
        return;
      }
    }
    else
    {
      if(Object.keys(this.#findRightParamList(values.toString(), this.#sendParams)).length != values.length)
      {
        console.error("PARAMS COUNTS ERROR FOR " + this.#cmd, this.#findRightParamList(values.toString(), this.#sendParams));
        return;
      }
    }
    
    this.#requestType = "write";
    this.#lines = [];
    this.#answer = "";
    this.#promise = new Promise((resolve, reject)=>{
      
      this.#promiseRes = resolve;
      this.#promiseRej = reject;
    });
    let cmd = this.#cmd + "=";
    for(var j=0;j<values.length;j++)
    {
      if(j > 0) cmd += ",";
      cmd += (values[j] + "").trim();
    }
    SIMSerial.Send(cmd + "\r\n", this);
    return this.#promise;
  }
  
  Test()
  {
    if(!this.#test)
    {
      console.error("NO TEST AVAILABLE FOR COMMAND " + this.#cmd);
      return;
    }
    this.#requestType = "test";
    this.#lines = [];
    this.#answer = "";
    this.#promise = new Promise((resolve, reject)=>{
      
      this.#promiseRes = resolve;
      this.#promiseRej = reject;
    });
    SIMSerial.Send(this.#cmd + "=?\r\n", this);
    return this.#promise;
  }
  
  Parse(str)
  {
    let isSuccess = false;
    this.#answerRaw = "";
    this.value = "";
    this.#answer = str;
    this.#answerValue = null;
    this.#lines = [];
    const lines = str.split("\r");
    for(var j=0;j<lines.length;j++)
    {
      if(lines[j].trim().length > 0) 
      {
        const line = lines[j].trim();
        this.#lines.push(line);
        if(line == "OK") isSuccess = true;
        if(line.startsWith(this.#cmd.replace("AT+", "+") + ":"))
        {
          switch(this.#requestType)
          {
            case "exe": this.#answerValue = this.#findRightParamList(line, this.#exeParams); break;
            case "write": this.#answerValue = this.#findRightParamList(line, this.#writeParams); break;
            case "read": this.#answerValue = this.#findRightParamList(line, this.#readParams); break;
            case "test": this.#answerValue = this.#findRightParamList(line, this.#testParams); break;
          }
          if(this.#answerValue != null)
          {
            let vals = this.Comma2List(line);//line.substring(line.indexOf(":") + 1).trim().split(/"+(.*?)"|(.*?)(,|$)/gm);
            let valsIndex = 0;
            const keys = Object.keys(this.#answerValue);
            if(keys.length == vals.length)
            {
              keys.forEach(k=>{
                this.#answerValue[k] = vals[valsIndex++];
              });
            }
            else
            {
              console.error("Values count is different from command parameters");
            }
          }
          this.#answerRaw = line;
        }
        if(this.#answerRaw == "" && line!= this.#cmd) this.#answerRaw = line;
      }
    }
    if(this.#answerValue == null) this.#answerValue = this.#answerRaw;
    if(this.#promise != null) 
    {
      if(isSuccess) this.#promiseRes(this);
      else this.#promiseRej(str);

      setTimeout(()=>{this.#promise = null;}, 50);
    }
    return this.#answerRaw;
  }
  
  Comma2List(line)
  {
    const regex = /(?:^|,)((?:[^\",]|\"[^\"]*\")*)/gm;
    let m;
    let vals = [];
    const line2 = line.startsWith("+") ? line.substring(line.indexOf(":") + 1).trim() : line.trim();
    while ((m = regex.exec(line2)) !== null) 
    {
      if (m.index === regex.lastIndex) regex.lastIndex++;
      if(m.length == 2) vals.push(m[1]);
    }
    return vals;
  }
  
  #findRightParamList(line, params)
  {
    let vals = this.Comma2List(line);
    
    //let valsT = line.substring(line.indexOf(":") + 1).trim().split(/"+(.*?)"(,|$)|(.*?)(,|$)/gm);
    let foundIndex = -1;
    for(let j=0;j<params.length;j++)
    {
      if(Object.keys(params[j]).length == vals.length)
      {
        if(foundIndex < 0) foundIndex = j;
        else foundIndex = 999;
      }
    }
    if(foundIndex < 0)
    {
      console.error("No param counts found for this line: " + line);
      return null;
    }
    else if(foundIndex == 999)
    {
      for(let j=0;j<params.length;j++)
      {
        if(Object.keys(params[j]).length == vals.length)
        {
          for(let h=0;h<Object.keys(params[j]).length;h++)
          {
            const k0 = Object.keys(params[j])[h];
            if(params[j][k0] != null)
            {
              if(params[j][k0] == vals[h] && foundIndex == 999) 
              {
                foundIndex = j;
              }
              break;
            }
          }
        }
      }
      
      if(foundIndex == 999)
      {
        console.error("Not yet implemented. Need to find which parameter list use for this line", line);
        return null;
      }
    }
    return Object.assign({}, params[foundIndex]);
  }
  
  GetLines()
  {
    return this.#lines;
  }
  
  GetRequestType()
  {
    return this.#requestType;
  }
  
  GetParamDiv(param, description, defaultVal)
  {
    let ret = {div:null, inp:null};
    ret.div = _CN("div", {class:"paramdiv"}, [_CN("p", {}, [description])]);
    const p = this.GetParam(param);
    if(p == null)
    {
      _CN("b", {}, ["ERROR: " + param +" does not exists!"], ret.div);
      return ret;
    }
    
    if(p.GetType() == "string" || p.GetType() == "url")
    {
      ret.inp = _CN("input", {type:"text", value:""}, [], ret.div);
    }
    else if(p.GetType() == "number")
    {
      ret.inp = _CN("input", {type:"number", value:""}, [], ret.div);
    }
    else if(typeof p.GetType() == "object")
    {
      ret.inp = _CN("select", {}, [], ret.div);
      p.GetPossibleValues().forEach(pv=>{
        let o = _CN("option", {value:pv.v}, ["[" + pv.v + "] " + pv.d], ret.inp);
        if(pv.v == defaultVal) o.selected = true;
      });
    }
    return ret;
  }
  
  ShowChat(div)
  {
    this.ShowChatError(div);
    let linesShow = 0;
    this.#lines.forEach(l=>{
      if(l.trim().length > 3)
      {
        linesShow++;
        _CN("span", {}, [l.trim()], div);
      }
    });
    if(linesShow == 0)
    {
      this.#lines.forEach(l=>{
        if(l.trim().length > 0)
        {
          linesShow++;
          _CN("span", {}, [l.trim()], div);
        }
      });
    }
  }
  
  ShowChatError(div)
  {
    this.#lines.forEach(l=>{
      if(l.trim().length > 0)
      {
        const regex = /^ERROR|^\+[A-Z]* ERROR:/gm;
        let m;
        if ((m = regex.exec(l)) !== null) {
          m.forEach((match, groupIndex) => {
            _CN("span", {style:"background:#f88;"}, [l.trim()], div);
          });
        }
      }
    });
  }
};

let ATs = [];
let ATTotScripts = 0;
let ATScriptsLoaded = 0;

window.addEventListener("load", ()=>{
  // Load base AT commands
  addATCommands("modules/at.json");
});

function addATCommands(jsonFile)
{
  fetch(jsonFile).then(r=>{
    return r.json();
  }).then(j=>{
    console.log(j);
    ATTotScripts += j.length;
    j.forEach(cmd=>{
      cmd = cmd.replace("+", "_");
      _CN("script", {src:`modules/at/${cmd}.js?v=95`}, [], document.head).addEventListener("load", ()=>{
        ATScriptsLoaded++;
      });
    });
  });
}