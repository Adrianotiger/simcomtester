class SelectDiv
{
  #div = null;
  #str = "";
  #range = null;
  #rangeOffset = 0;
  #originalLen = 0;
  #rangeLen = -1;

  constructor(div, startStr, range)
  {
    this.#div = div;
    this.#str = startStr;
    this.#range = range;
    this.#rangeOffset = range.startOffset - startStr.length;
    this.#originalLen = range.endContainer.length;
    if(this.#div.options && this.#div.options.length > 0)
      this.#div.options[0].selected = true;
    this.#rangeLen = 2;
    let lastCh = "";
    do
    {
      lastCh = this.#range.endContainer.textContent[this.#rangeOffset + this.#rangeLen++]
    } while(lastCh == '+' || lastCh >='A' && lastCh <= 'Z' || lastCh>='0' && lastCh<='9');
    this.#rangeLen--;
  }

  Update()
  {
    let strF = this.#range.endContainer.data.substring(this.#rangeOffset).trim();
    if(strF.indexOf("\n")>0) strF = strF.substring(0, strF.indexOf("\n"));
    if(this.#range.endContainer.data.length < this.#str.length)
    {
      this.Close();
      return false;
    }
    let first = true;
    let visible = 0;
    [...this.#div.options].forEach(o=>{
      if(o.value.startsWith(strF))
      {
        o.style.display = "";
        visible++;
        if(first) {o.selected = true; first = false;}
      }
      else
      {
        o.style.display = "none";
      }
    });
    if(visible <= 1)
    {
      this.Close();
      return false;
    }
    return true;
  }

  Select()
  {
    const rangeTxt = this.#range.endContainer.textContent;
    const startOff = this.#range.startOffset;
    let strEnd = this.#range.endContainer.textContent.substring(0, startOff - this.#str.length);
    let cutPos = strEnd.length;
    while(rangeTxt[cutPos] == '+' || rangeTxt[cutPos] >='A' && rangeTxt[cutPos] <= 'Z' || rangeTxt[cutPos]>='0' && rangeTxt[cutPos]<='9') cutPos++;
    strEnd += this.#div.value;
    const newPos = strEnd.length;
    strEnd += rangeTxt.substring(cutPos);
    this.#range.endContainer.textContent = strEnd;
    this.Close();
    const selection = window.getSelection(); // find cursor position
    console.log(selection);
    selection.setPosition(selection.baseNode, newPos);
  }

  MoveSelected(qty)
  {
    let lastO = null;
    [...this.#div.options].forEach(o=>{
      if(o.selected)
      {
        if(qty == -1 && lastO != null) lastO.selected = true;
        else qty = -10;
      }
      else if(qty == -10 && o.style.display == "")
      {
        o.selected = true;
        qty = 0;
      }
      if(o.style.display == "") lastO = o;
    });
  }

  Close()
  {
    this.#div.parentNode?.removeChild(this.#div);
  }
};

let ScriptEditor = new class
{
  #backDiv;
  #overlayDiv;
  #linesDiv;
  #execDiv;
  #outputDiv;

  #lastTimestamp = -1;
  #updatingText = false;

  #selectDiv = null;

  #listingTexts = [];

  constructor()
  {
  }

  SetWorkingDiv(div)
  {
    this.#linesDiv = _CN("div", {class:"tabscripteditor tabscriptlines"}, [], div);
    this.#overlayDiv = _CN("div", {class:"tabscripteditor tabscriptedit", contenteditable:"plaintext-only"}, [], div);
    this.#backDiv = _CN("div", {class:"tabscripteditor", style:"pointer-events:none;left:0px;top:0px;opacity:1;white-space:pre;"}, [], div);

    let txt = "# SAMPLE SCRIPT\n";
    txt += "# start a line with '#' to set it as comment.\n";
    txt += "# By writing AT, a dropdown list with commands will appear.\n";
    txt += "AT\n";
    txt += "AT+COPS?\n";
    txt += "# Special commands:\n";
    txt += "# WAIT X (stop script for X seconds)\n";
    txt += "# IF...END (execute if)\n";
    txt += "IF AT+CNACT.Active0 = 0\n";
    txt += "AT+CNACT= 0,1\n";
    txt += "WAIT 3\n";
    txt += "END\n";

    this.SetText(txt);

    this.#prepareDiv();
  }

  GetText()
  {
    return this.#overlayDiv.textContent;
  }

  SetText(txt)
  {
    this.#overlayDiv.textContent = txt;
    this.#updateText();
  }

  AddTextListener(str, func)
  {
    let obj = {str:str, f:(r)=>{func(r);}};
    this.#listingTexts.push(obj);
  }

  ShowList(range, items, startString)
  {
    this.#selectDiv?.Close();

    console.log(range, items, startString);

    let sel = _CN("select", {size:5, style:"position:absolute;left:0px;top:0px;display:none;width:200px;height:130px;font-size:12px;z-index:1001;"}, [], document.body);
    items.forEach(k=>{
      _CN("option", {value:k}, [k], sel);
    });
    const rect = range.getClientRects()[0];
    if (rect)
    {
      sel.style.left = (rect.left - 30) + "px";
      sel.style.top = (rect.top + 20) + "px";
      sel.style.display = "block";
      [...sel.getElementsByTagName("option")].forEach(o=>{o.style.display="";});
    }
    this.#selectDiv = new SelectDiv(sel, startString, range);

    sel.addEventListener("click", (e)=>{
      this.#selectDiv.Select();
      this.#selectDiv = null;
      this.#updateText(e.timeStamp);
    });
  }

  ResetExecuting()
  {
    this.#execDiv.textContent = "";
    while(this.#outputDiv.childNodes.length > 0) this.#outputDiv.removeChild(this.#outputDiv.childNodes[0]);
  }

  ExecuteNextLine(lastLine)
  {
    if(this.#execDiv.childNodes.length > 0) 
    {
      this.#execDiv.removeChild(this.#execDiv.childNodes[this.#execDiv.childNodes.length - 1]);

      this.#outputDiv.appendChild(document.createTextNode(lastLine));
      _CN("br", null, null, this.#outputDiv);

      this.#execDiv.appendChild(document.createTextNode("✔"));
      _CN("br", null, null, this.#execDiv);
    }

    this.#execDiv.appendChild(document.createTextNode("⚡"));
  }

  ErrorExecuting(msg)
  {
    if(this.#execDiv.childNodes.length > 0) this.#execDiv.removeChild(this.#execDiv.childNodes[this.#execDiv.childNodes.length - 1]);
    this.#execDiv.appendChild(document.createTextNode("❌"));

    this.#outputDiv.appendChild(document.createTextNode(msg));
  }

  FinishExecuting(msg)
  {
    if(this.#execDiv.childNodes.length > 0) this.#execDiv.removeChild(this.#execDiv.childNodes[this.#execDiv.childNodes.length - 1]);
    this.#execDiv.appendChild(document.createTextNode("✅"));

    this.#outputDiv.appendChild(document.createTextNode(msg));
  }

  async #prepareDiv()
  {
    let lineNr = _CN("div", {style:"position:absolute;left:20px;width:20px;text-align:right;"}, [], this.#linesDiv);
    for(let j=1;j<300;j++) _CN("div", {}, [j], lineNr);

    this.#execDiv = _CN("div", {style:"position:absolute;left:0px;width:20px;text-align:center;"}, ["⚡"], this.#linesDiv);
    this.#outputDiv = _CN("div", {style:"position:absolute;right:5px;width:400px;text-align:right;white-space:nowrap;text-overflow:ellipsis;overflow-x:hidden;"}, [], this.#linesDiv);

    this.#overlayDiv.addEventListener("scroll", (e)=>{
      this.#backDiv.scrollTo(0 , this.#overlayDiv.scrollTop);
      this.#linesDiv.scrollTo(0 , this.#overlayDiv.scrollTop);
    });

    this.#overlayDiv.addEventListener("input", (e)=>{
      //console.log("input", e);
      this.#updateText(Number.parseInt(e.timeStamp));
      return this.#keyEvent(e);
    });

    this.#overlayDiv.addEventListener("keydown", (e)=>{
      //console.log("keydown", e);
      return this.#keyEvent(e);
    });

    this.#overlayDiv.addEventListener("click", (e)=>{
      //console.log("click", e);
      if(this.#selectDiv !== null)
      {
        this.#updateText(e.timeStamp);
        this.#selectDiv.Close();
        this.#selectDiv = null;
        return false;
      }
    });
  }

  async #updateText(timeStamp=-1)
  {
    if(timeStamp > 0 && timeStamp>this.#lastTimestamp) this.#lastTimestamp = timeStamp;
    if(this.#updatingText) return;
    this.#updatingText = true;

    let strO = this.GetText();

    strO = strO.replace(/^([ ]*IF[A-Za-z0-9\. \+]+=[ ]*[A-Za-z0-9\.]*)/gm, "<span style='color:#aa6;'>$1</span>");
    strO = strO.replace(/^([ ]*END)/gm, "<span style='color:#aa6;'>$1</span>");
    strO = strO.replace(/(^(?!#)[ ]*\bAT[+A-Z=?]*)/gm, "<span style='color:green;'>$1</span>");
    strO = strO.replace(/^([ ]*WAIT[ 0-9]*)/gm, "<span style='color:#66a;'>$1</span>");
    strO = strO.replace(/^([ ]*DATA .*$)/gm, "<span style='color:#543;'>$1</span>");
    strO = strO.replace(/^(#.*?)$/gm, "<span style='color:#888;'>$1</span>");
    strO = strO.replace(/\n/gmi, " <br>");
    
    this.#backDiv.innerHTML = strO;

    this.#backDiv.scrollTo(0 , this.#overlayDiv.scrollTop);
    this.#linesDiv.scrollTo(0 , this.#overlayDiv.scrollTop);

    if(timeStamp > 0 && this.#lastTimestamp > timeStamp)
    {
      const newTS = this.#lastTimestamp;
      setTimeout(()=>{
        this.#updateText(newTS);
      }, 100);
      return;
    }
    this.#updatingText = false;
  
  }

  #keyEvent(e)
  {
    let ret = true;
    e.stopPropagation();

    if(this.#selectDiv !== null)
    {
      let removeDiv = false;
      if(e.key) // keydown
      {
        switch(e.key)
        {
          case 'Backspace': removeDiv = !this.#selectDiv.Update(); break;
          case 'ArrowUp': this.#selectDiv.MoveSelected(-1); ret = false; break;
          case 'ArrowDown': this.#selectDiv.MoveSelected(+1); ret = false; break;
          case 'ArrowLeft': 
          case 'ArrowRight': 
          case 'End': 
          case 'Home': 
          case 'Escape': removeDiv = true; this.#selectDiv.Close(); break;
          case 'Enter': this.#selectDiv.Select(); this.#updateText(e.timeStamp); ret = false; removeDiv = true;  break;
        }
        if(!ret) e.preventDefault();
      }
      if(e.data)
      {
        if(e.data >='A' && e.data <= 'Z' || e.data>='0' && e.data<='9' || e.data=='+')
        {
          this.#selectDiv.Update();
        }
        else
        {
          this.#selectDiv.Close();
          removeDiv = true;
        }
      }
      else if(e.inputType)
      {
        switch(e.inputType)
        {
          case 'deleteContentBackward': 
            removeDiv = !this.#selectDiv.Update(); 
            break;
        }
      }

      if(removeDiv)
      {
        e.preventDefault();
        this.#selectDiv = null;
        ret = false;
      }
      //console.log(this.#selectDiv);
    }
    else
    {
      //console.log(e);
      const selection = window.getSelection(); // find cursor position
      if(selection.rangeCount !== 1) return true;
      const range = selection.getRangeAt(0);

      this.#listingTexts.forEach(lt=>{
        if(range?.startContainer?.nodeValue?.substring(selection.baseOffset-lt.str.length, selection.baseOffset) == lt.str)
        {
          lt.f(range);
        }
      });
    }
    return ret;
  }

  #addChar(ch)
  {
    console.log(ch);
  }
  
};